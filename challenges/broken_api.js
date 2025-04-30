/**
 * ===== CHALLENGE 2: THE BROKEN API =====
 * 
 * Your task is to fix this broken REST API endpoint to retrieve the next clue.
 * The API should authenticate with the provided token and return the next challenge password.
 * 
 * INSTRUCTIONS:
 * 1. Identify and fix all issues in the code below
 * 2. When fixed, the API should return a JSON response with the next password
 * 3. Enter the password on the challenge page to unlock the next challenge
 * 
 * HINT: Check the request headers and authentication method
 */

const express = require('express');
const app = express();
const port = 3000;

// This should be stored securely in environment variables
const API_KEY = 'ing-tech-hunt-api-key-2025';

// Middleware for parsing JSON bodies
app.use(express.json);  // BUG: Missing parentheses - should be express.json()

// Authentication middleware
const authenticate = (req, res, next) => {
  // BUG: Wrong header name - should be 'Authorization'
  const token = req.headers['auth-token']; 
  
  // BUG: Missing token check
  if (!token) {
    return res.status(401).json({ error: 'Authentication token is required' });
  }
  
  // BUG: Incorrect token format check - should check for Bearer prefix
  if (token !== API_KEY) {
    return res.status(403).json({ error: 'Invalid authentication token' });
  }
  
  next();
};

// API endpoint to get the next clue
app.get('/api/clue', authenticate, (req, res) => {
  // BUG: Using callback incorrectly - should use proper error handling
  try {
    // Simulate database query
    const clue = getNextClue();
    
    // BUG: Response is not being sent
    res.status(200).json({
      success: true,
      message: 'Congratulations! You fixed the API.',
      nextPassword: 'APImaster456'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to get the next clue
function getNextClue() {
  // BUG: This would throw an error - clueData is not defined
  return {
    id: 3,
    title: 'SQL Injection Prevention',
    hint: 'Always use parameterized queries'
  };
}

// Start the server
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});

/**
 * ===== SOLUTION (HIDDEN) =====
 * 
 * Fixed issues:
 * 1. Added parentheses to express.json()
 * 2. Changed header name from 'auth-token' to 'Authorization'
 * 3. Added proper token check with Bearer prefix
 * 4. Fixed error handling in the API endpoint
 * 5. Added proper response sending
 * 6. Fixed the getNextClue function to not reference undefined variables
 * 
 * To test the fixed API:
 * curl -X GET http://localhost:3000/api/clue -H "Authorization: Bearer ing-tech-hunt-api-key-2025"
 * 
 * Password: APImaster456
 */