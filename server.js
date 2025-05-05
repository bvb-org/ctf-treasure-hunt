const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3123;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

// Set up SQLite database
const dbPath = process.env.DB_PATH || path.join(__dirname, 'treasure_hunt.db');
console.log(`Using database at: ${dbPath}`);
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  // Teams table
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      score INTEGER DEFAULT 0
    )
  `);

  // Completed challenges table
  db.run(`
    CREATE TABLE IF NOT EXISTS completed_challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id TEXT NOT NULL,
      challenge_id TEXT NOT NULL,
      points INTEGER NOT NULL,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (team_id) REFERENCES teams (id),
      UNIQUE(team_id, challenge_id)
    )
  `);
});

// Make sure hunt_config table exists and has at least one row
db.get('SELECT COUNT(*) as count FROM hunt_config', [], (err, result) => {
  if (err) {
    // Table doesn't exist, create it
    db.run(`
      CREATE TABLE IF NOT EXISTS hunt_config (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        start_time TIMESTAMP,
        duration_minutes INTEGER DEFAULT 240,
        is_active BOOLEAN DEFAULT 0
      )
    `, function(err) {
      if (err) {
        console.error('Error creating hunt_config table:', err);
      } else {
        // Insert default row
        db.run('INSERT OR IGNORE INTO hunt_config (id, start_time, duration_minutes, is_active) VALUES (1, NULL, 240, 0)');
      }
    });
  } else if (result.count === 0) {
    // Table exists but has no rows, insert default row
    db.run('INSERT INTO hunt_config (id, start_time, duration_minutes, is_active) VALUES (1, NULL, 240, 0)');
  }
});

// Make sure admin_users table exists and has at least one admin user
db.get('SELECT COUNT(*) as count FROM admin_users', [], (err, result) => {
  if (err) {
    // Table doesn't exist, create it
    db.run(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `, function(err) {
      if (err) {
        console.error('Error creating admin_users table:', err);
      } else {
        // Insert default admin user
        db.run('INSERT OR IGNORE INTO admin_users (username, password) VALUES ("admin", "admin")');
      }
    });
  } else if (result.count === 0) {
    // Table exists but has no rows, insert default admin
    db.run('INSERT INTO admin_users (username, password) VALUES ("admin", "admin")');
  }
});

// Team-specific routes - dynamically handle team URLs
app.get('/:teamId', (req, res, next) => {
  const teamId = req.params.teamId;
  
  // Skip known routes
  if (teamId === 'admin-login.html' || teamId === 'admin-portal.html' || teamId === 'api') {
    return next();
  }
  
  // Check if team exists in database
  db.get('SELECT id FROM teams WHERE id = ?', [teamId], (err, team) => {
    if (err) {
      console.error('Error checking team:', err);
      return res.redirect('/');
    }
    
    if (team) {
      res.sendFile(path.join(__dirname, 'team-login.html'));
    } else {
      res.redirect('/');
    }
  });
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// No duplicate route needed - already handled above

// API endpoints for team scores

// Get all team scores (for leaderboard)
app.get('/api/leaderboard', (req, res) => {
  db.all(`
    SELECT t.id, t.name, t.score,
           COUNT(DISTINCT cc.challenge_id) as completed_challenges,
           MAX(cc.completed_at) as last_completion
    FROM teams t
    LEFT JOIN completed_challenges cc ON t.id = cc.team_id
    GROUP BY t.id
    ORDER BY t.score DESC, last_completion ASC
  `, (err, rows) => {
    if (err) {
      console.error('Error fetching leaderboard:', err);
      return res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
    res.json(rows);
  });
});

// Get all teams for team selection
app.get('/api/teams', (req, res) => {
  db.all('SELECT id, name FROM teams', [], (err, teams) => {
    if (err) {
      console.error('Error fetching teams:', err);
      return res.status(500).json({ error: 'Failed to fetch teams' });
    }
    res.json(teams);
  });
});

// Get top teams (for sidebar)
app.get('/api/top-teams', (req, res) => {
  const limit = req.query.limit || 3;
  db.all(`
    SELECT id, name, score
    FROM teams
    ORDER BY score DESC
    LIMIT ?
  `, [limit], (err, rows) => {
    if (err) {
      console.error('Error fetching top teams:', err);
      return res.status(500).json({ error: 'Failed to fetch top teams' });
    }
    res.json(rows);
  });
});

// Get a specific team's data
app.get('/api/teams/:teamId', (req, res) => {
  const teamId = req.params.teamId;
  db.get('SELECT id, name, score FROM teams WHERE id = ?', [teamId], (err, team) => {
    if (err) {
      console.error('Error fetching team:', err);
      return res.status(500).json({ error: 'Failed to fetch team data' });
    }
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    // Get completed challenges
    db.all('SELECT challenge_id, points FROM completed_challenges WHERE team_id = ?', [teamId], (err, challenges) => {
      if (err) {
        console.error('Error fetching completed challenges:', err);
        return res.status(500).json({ error: 'Failed to fetch completed challenges' });
      }
      
      team.completedChallenges = challenges.map(c => c.challenge_id);
      res.json(team);
    });
  });
});

// Verify team password
app.post('/api/teams/:teamId/verify', (req, res) => {
  const teamId = req.params.teamId;
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ success: false, error: 'Password is required' });
  }
  
  // Check if team exists and password matches
  db.get('SELECT id, name, password, score FROM teams WHERE id = ?', [teamId], (err, team) => {
    if (err) {
      console.error('Error verifying team credentials:', err);
      return res.status(500).json({ success: false, error: 'Failed to verify team credentials' });
    }
    
    if (!team) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    
    if (team.password !== password) {
      return res.status(401).json({ success: false, error: 'Incorrect password' });
    }
    
    // Get completed challenges
    db.all('SELECT challenge_id FROM completed_challenges WHERE team_id = ?', [teamId], (err, challenges) => {
      if (err) {
        console.error('Error fetching completed challenges:', err);
        return res.status(500).json({ success: false, error: 'Failed to fetch completed challenges' });
      }
      
      const completedChallenges = challenges.map(c => c.challenge_id);
      
      res.json({
        success: true,
        name: team.name,
        score: team.score,
        completedChallenges: completedChallenges
      });
    });
  });
});

// Update team score when a challenge is completed
app.post('/api/teams/:teamId/complete-challenge', (req, res) => {
  const teamId = req.params.teamId;
  const { challengeId, points } = req.body;
  
  if (!challengeId || !points) {
    return res.status(400).json({ error: 'Challenge ID and points are required' });
  }
  
  db.serialize(() => {
    // Begin transaction
    db.run('BEGIN TRANSACTION');
    
    // Insert completed challenge
    db.run(
      'INSERT OR IGNORE INTO completed_challenges (team_id, challenge_id, points) VALUES (?, ?, ?)',
      [teamId, challengeId, points],
      function(err) {
        if (err) {
          console.error('Error recording completed challenge:', err);
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to record completed challenge' });
        }
        
        // Only update score if this is a new completion (not already completed)
        if (this.changes > 0) {
          // Update team score
          db.run(
            'UPDATE teams SET score = score + ? WHERE id = ?',
            [points, teamId],
            function(err) {
              if (err) {
                console.error('Error updating team score:', err);
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Failed to update team score' });
              }
              
              // Commit transaction
              db.run('COMMIT');
              
              // Get updated team data
              db.get('SELECT id, name, score FROM teams WHERE id = ?', [teamId], (err, team) => {
                if (err) {
                  console.error('Error fetching updated team:', err);
                  return res.status(500).json({ error: 'Failed to fetch updated team data' });
                }
                
                res.json({
                  success: true,
                  message: 'Challenge completed successfully',
                  team: team
                });
              });
            }
          );
        } else {
          // Challenge was already completed
          db.run('COMMIT');
          res.json({
            success: false,
            message: 'Challenge was already completed',
          });
        }
      }
    );
  });
});

// Admin routes
app.get('/admin-login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-login.html'));
});

app.get('/admin-portal.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-portal.html'));
});

// Admin API endpoints
// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check credentials against database
  db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Error checking admin credentials:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
    
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    res.json({ success: true });
  });
});

// Get all teams
app.get('/api/admin/teams', (req, res) => {
  db.all('SELECT id, name, password, score FROM teams', [], (err, teams) => {
    if (err) {
      console.error('Error fetching teams:', err);
      return res.status(500).json({ error: 'Failed to fetch teams' });
    }
    
    // Get members for each team
    const promises = teams.map(team => {
      return new Promise((resolve, reject) => {
        db.all('SELECT id, name, email FROM team_members WHERE team_id = ?', [team.id], (err, members) => {
          if (err) {
            reject(err);
            return;
          }
          
          team.members = members;
          resolve(team);
        });
      });
    });
    
    Promise.all(promises)
      .then(teamsWithMembers => {
        res.json(teamsWithMembers);
      })
      .catch(error => {
        console.error('Error fetching team members:', error);
        res.status(500).json({ error: 'Failed to fetch team members' });
      });
  });
});

// Get a specific team
app.get('/api/admin/teams/:teamId', (req, res) => {
  const teamId = req.params.teamId;
  
  db.get('SELECT id, name, password, score FROM teams WHERE id = ?', [teamId], (err, team) => {
    if (err) {
      console.error('Error fetching team:', err);
      return res.status(500).json({ error: 'Failed to fetch team' });
    }
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    // Get members for the team
    db.all('SELECT id, name, email FROM team_members WHERE team_id = ?', [teamId], (err, members) => {
      if (err) {
        console.error('Error fetching team members:', err);
        return res.status(500).json({ error: 'Failed to fetch team members' });
      }
      
      team.members = members;
      res.json(team);
    });
  });
});

// Create a new team
app.post('/api/admin/teams', (req, res) => {
  const { name, password, members } = req.body;
  
  if (!name || !password) {
    return res.status(400).json({ error: 'Team name and password are required' });
  }
  
  // Generate a unique ID based on the team name
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  db.serialize(() => {
    // Begin transaction
    db.run('BEGIN TRANSACTION');
    
    // Insert team
    db.run(
      'INSERT INTO teams (id, name, password, score) VALUES (?, ?, ?, ?)',
      [id, name, password, 0],
      function(err) {
        if (err) {
          console.error('Error creating team:', err);
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to create team' });
        }
        
        // Insert members if provided
        if (members && members.length > 0) {
          const insertMember = db.prepare('INSERT INTO team_members (team_id, name, email) VALUES (?, ?, ?)');
          
          try {
            members.forEach(member => {
              insertMember.run(id, member.name, member.email || null);
            });
            insertMember.finalize();
          } catch (error) {
            console.error('Error inserting team members:', error);
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Failed to insert team members' });
          }
        }
        
        // Commit transaction
        db.run('COMMIT');
        
        res.status(201).json({ success: true, id: id });
      }
    );
  });
});

// Update a team
app.put('/api/admin/teams/:teamId', (req, res) => {
  const teamId = req.params.teamId;
  const { name, password, members } = req.body;
  
  if (!name || !password) {
    return res.status(400).json({ error: 'Team name and password are required' });
  }
  
  db.serialize(() => {
    // Begin transaction
    db.run('BEGIN TRANSACTION');
    
    // Update team
    db.run(
      'UPDATE teams SET name = ?, password = ? WHERE id = ?',
      [name, password, teamId],
      function(err) {
        if (err) {
          console.error('Error updating team:', err);
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to update team' });
        }
        
        if (this.changes === 0) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: 'Team not found' });
        }
        
        // Delete existing members
        db.run('DELETE FROM team_members WHERE team_id = ?', [teamId], function(err) {
          if (err) {
            console.error('Error deleting team members:', err);
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Failed to update team members' });
          }
          
          // Insert new members if provided
          if (members && members.length > 0) {
            const insertMember = db.prepare('INSERT INTO team_members (team_id, name, email) VALUES (?, ?, ?)');
            
            try {
              members.forEach(member => {
                insertMember.run(teamId, member.name, member.email || null);
              });
              insertMember.finalize();
            } catch (error) {
              console.error('Error inserting team members:', error);
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Failed to insert team members' });
            }
          }
          
          // Commit transaction
          db.run('COMMIT');
          
          res.json({ success: true });
        });
      }
    );
  });
});

// Delete a team
app.delete('/api/admin/teams/:teamId', (req, res) => {
  const teamId = req.params.teamId;
  
  db.serialize(() => {
    // Begin transaction
    db.run('BEGIN TRANSACTION');
    
    // Delete team members first (foreign key constraint)
    db.run('DELETE FROM team_members WHERE team_id = ?', [teamId], function(err) {
      if (err) {
        console.error('Error deleting team members:', err);
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Failed to delete team members' });
      }
      
      // Delete completed challenges
      db.run('DELETE FROM completed_challenges WHERE team_id = ?', [teamId], function(err) {
        if (err) {
          console.error('Error deleting completed challenges:', err);
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to delete completed challenges' });
        }
        
        // Delete team
        db.run('DELETE FROM teams WHERE id = ?', [teamId], function(err) {
          if (err) {
            console.error('Error deleting team:', err);
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Failed to delete team' });
          }
          
          if (this.changes === 0) {
            db.run('ROLLBACK');
            return res.status(404).json({ error: 'Team not found' });
          }
          
          // Commit transaction
          db.run('COMMIT');
          
          res.json({ success: true });
        });
      });
    });
  });
});

// Get hunt configuration
app.get('/api/admin/config', (req, res) => {
  db.get('SELECT start_time, duration_minutes, is_active FROM hunt_config WHERE id = 1', [], (err, config) => {
    if (err) {
      console.error('Error fetching hunt configuration:', err);
      return res.status(500).json({ error: 'Failed to fetch hunt configuration' });
    }
    
    res.json(config || { start_time: null, duration_minutes: 240, is_active: 0 });
  });
});

// Update hunt configuration
app.put('/api/admin/config', (req, res) => {
  const { start_time, duration_minutes, is_active } = req.body;
  
  if (!start_time || !duration_minutes) {
    return res.status(400).json({ error: 'Start time and duration are required' });
  }
  
  db.run(
    'UPDATE hunt_config SET start_time = ?, duration_minutes = ?, is_active = ? WHERE id = 1',
    [start_time, duration_minutes, is_active],
    function(err) {
      if (err) {
        console.error('Error updating hunt configuration:', err);
        return res.status(500).json({ error: 'Failed to update hunt configuration' });
      }
      
      res.json({ success: true });
    }
  );
});

// Get admin settings
app.get('/api/admin/settings', (req, res) => {
  db.get('SELECT id, username FROM admin_users LIMIT 1', [], (err, admin) => {
    if (err) {
      console.error('Error fetching admin settings:', err);
      return res.status(500).json({ error: 'Failed to fetch admin settings' });
    }
    
    res.json(admin || { username: 'admin' });
  });
});

// Update admin settings
app.put('/api/admin/settings', (req, res) => {
  const { username, current_password, new_password } = req.body;
  
  if (!username || !current_password || !new_password) {
    return res.status(400).json({ error: 'Username, current password, and new password are required' });
  }
  
  // Verify current password
  db.get('SELECT id FROM admin_users WHERE password = ? LIMIT 1', [current_password], (err, admin) => {
    if (err) {
      console.error('Error verifying admin password:', err);
      return res.status(500).json({ error: 'Failed to verify admin password' });
    }
    
    if (!admin) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Update admin settings
    db.run(
      'UPDATE admin_users SET username = ?, password = ? WHERE id = ?',
      [username, new_password, admin.id],
      function(err) {
        if (err) {
          console.error('Error updating admin settings:', err);
          return res.status(500).json({ error: 'Failed to update admin settings' });
        }
        
        res.json({ success: true });
      }
    );
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Main page: http://localhost:${port}/`);
  console.log(`Admin portal: http://localhost:${port}/admin-login.html`);
  
  // Log available teams from database
  db.all('SELECT id, name FROM teams', [], (err, teams) => {
    if (!err && teams.length > 0) {
      console.log('Available team routes:');
      teams.forEach(team => {
        console.log(`- http://localhost:${port}/${team.id}`);
      });
    }
  });
});