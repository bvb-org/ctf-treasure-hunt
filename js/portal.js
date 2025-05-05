document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!isTeamAuthenticated()) {
        // Redirect to the appropriate login page
        redirectToLogin();
        return;
    }
    
    // Initialize the challenge portal with team data
    initChallengePortal();
    
    // Start the countdown timer
    initCountdownTimer();
    
    // Set up challenge navigation
    initChallengeNavigation();
    
    // Set up form submissions
    initFormSubmissions();
    
    // Set up logout functionality
    initLogout();
});

// Check if a team is authenticated
function isTeamAuthenticated() {
    const teamData = sessionStorage.getItem('currentTeam');
    return !!teamData;
}

// Redirect to the appropriate login page
function redirectToLogin() {
    // Get team ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get('team');
    
    if (teamId) {
        window.location.href = `/${teamId}`;
    } else {
        window.location.href = '/index.html';
    }
}

// Initialize logout functionality
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear session storage
            sessionStorage.removeItem('currentTeam');
            
            // Redirect to main page
            window.location.href = '/index.html';
        });
    }
}

// Challenge data with answers (in a real implementation, this would be server-side)
const challengeData = {
    challenge1: {
        id: "challenge1",
        title: "The Hidden Message",
        answer: "SecurityFirst123",
        points: 100,
        nextChallenges: ["challenge2"]
    },
    challenge2: {
        id: "challenge2",
        title: "Network Puzzle",
        answer: "NETWORK",
        points: 150,
        nextChallenges: ["challenge3"]
    },
    challenge3: {
        id: "challenge3",
        title: "Password Strength",
        answer: "S3cur3P@ssw0rd25",
        points: 150,
        nextChallenges: ["challenge4", "challenge5"]
    },
    challenge4: {
        id: "challenge4",
        title: "HTTP Status Codes",
        answer: "HTTP200OK",
        points: 200,
        nextChallenges: ["challenge6"]
    },
    challenge5: {
        id: "challenge5",
        title: "Git Mystery",
        answer: "SECRETKYE",
        points: 200,
        nextChallenges: ["challenge6"]
    },
    challenge6: {
        id: "challenge6",
        title: "Tech Logo Quiz",
        answer: "TechBrands",
        points: 200,
        nextChallenges: ["challenge7", "challenge9"]
    },
    challenge7: {
        id: "challenge7",
        title: "Debug the Code",
        answer: "BugHunter42",
        points: 250,
        nextChallenges: ["challenge8"]
    },
    challenge8: {
        id: "challenge8",
        title: "IT Crossword Puzzle",
        answer: "TechTerms123",
        points: 300,
        nextChallenges: []
    },
    challenge9: {
        id: "challenge9",
        title: "Tech Emoji Pictionary",
        answer: "EmojiTech2025",
        points: 250,
        nextChallenges: ["challenge10"]
    },
    challenge10: {
        id: "challenge10",
        title: "Tech Timeline Puzzle",
        answer: "TechEvolution",
        points: 250,
        nextChallenges: ["challenge11"]
    },
    challenge11: {
        id: "challenge11",
        title: "Decode the Cipher",
        answer: "CRYPTOMASTER2025",
        points: 300,
        nextChallenges: []
    }
};

// Team state loaded from session storage
let teamState = {
    name: "",
    id: "",
    score: 0,
    startTime: new Date(),
    completedChallenges: [],
    currentChallenge: null,
    hintsUsed: {}
};

// Load team data from session storage
function loadTeamData() {
    const teamData = sessionStorage.getItem('currentTeam');
    if (teamData) {
        const team = JSON.parse(teamData);
        teamState.name = team.name;
        teamState.id = team.id;
        teamState.score = team.score || 0;
        teamState.completedChallenges = team.completedChallenges || [];
        teamState.hintsUsed = team.hintsUsed || {};
    }
}

// Initialize the challenge portal
function initChallengePortal() {
    // Load team data from session storage first (for quick display)
    loadTeamData();
    
    // Update team name in header
    document.getElementById('team-name').textContent = `Team: ${teamState.name}`;
    
    // Update score in header
    document.getElementById('team-score').textContent = `Score: ${teamState.score}`;
    
    // Fetch latest team data from server
    fetch(`/api/teams/${teamState.id}`)
        .then(response => response.json())
        .then(teamData => {
            // Update team state with server data
            if (teamData) {
                teamState.score = teamData.score || 0;
                teamState.completedChallenges = teamData.completedChallenges || [];
                
                // Update score display
                document.getElementById('team-score').textContent = `Score: ${teamState.score}`;
                
                // Update completed challenges in the UI
                teamState.completedChallenges.forEach(challengeId => {
                    updateChallengeList(challengeId);
                });
                
                // Update session storage
                updateTeamStorage();
            }
        })
        .catch(error => {
            console.error('Error fetching team data:', error);
        });
    
    // Update top teams in sidebar
    updateTopTeams();
    
    // Unlock all challenges from the beginning
    unlockAllChallenges();
    
    // Set the first challenge as active if no challenge is completed
    if (teamState.completedChallenges.length === 0) {
        teamState.currentChallenge = "challenge1";
        showChallengeScreen("challenge1");
        
        // Update the challenge list to show the first challenge as active
        const firstChallengeItem = document.querySelector('.challenge-item[data-challenge="challenge1"]');
        if (firstChallengeItem) {
            firstChallengeItem.classList.add('active');
            firstChallengeItem.querySelector('.challenge-status').textContent = 'Active';
            firstChallengeItem.querySelector('.challenge-status').className = 'challenge-status active';
        }
    } else {
        // Show the welcome screen by default
        showChallengeScreen("welcome-screen");
        
        // Update completed challenges in the UI
        teamState.completedChallenges.forEach(challengeId => {
            updateChallengeList(challengeId);
        });
    }
}

// Unlock all challenges from the beginning
function unlockAllChallenges() {
    const challengeItems = document.querySelectorAll('.challenge-item');
    challengeItems.forEach(item => {
        item.classList.remove('locked');
        
        // Only update status if it's not already completed
        const challengeId = item.getAttribute('data-challenge');
        if (!teamState.completedChallenges.includes(challengeId)) {
            const statusElement = item.querySelector('.challenge-status');
            if (statusElement) {
                statusElement.textContent = 'Pending';
                statusElement.className = 'challenge-status pending';
            }
        }
    });
}

// Initialize the countdown timer
function initCountdownTimer() {
    // Fetch hunt configuration from the server
    fetch('/api/admin/config')
        .then(response => response.json())
        .then(config => {
            if (!config.start_time) {
                console.error('Hunt not configured yet');
                return;
            }
            
            // Calculate the end time based on admin settings
            const startTime = new Date(config.start_time);
            const endTime = new Date(startTime.getTime() + (config.duration_minutes * 60000));
            
            // Update the timer every second
            const timerInterval = setInterval(function() {
                const now = new Date();
                const distance = endTime - now;
                
                // If the countdown is over
                if (distance < 0) {
                    clearInterval(timerInterval);
                    document.getElementById('hours').textContent = "00";
                    document.getElementById('minutes').textContent = "00";
                    document.getElementById('seconds').textContent = "00";
                    
                    // Show completion screen if time is up
                    showCompletionScreen();
                    return;
                }
                
                // Calculate hours, minutes, and seconds
                const hours = Math.floor(distance / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                // Display the time
                document.getElementById('hours').textContent = formatTime(hours);
                document.getElementById('minutes').textContent = formatTime(minutes);
                document.getElementById('seconds').textContent = formatTime(seconds);
            }, 1000);
        })
        .catch(error => {
            console.error('Error fetching hunt configuration:', error);
        });
}

// Format time to always have two digits
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Initialize challenge navigation
function initChallengeNavigation() {
    // Add click event listeners to challenge items
    const challengeItems = document.querySelectorAll('.challenge-item');
    challengeItems.forEach(item => {
        item.addEventListener('click', function() {
            const challengeId = this.getAttribute('data-challenge');
            
            // Only allow clicking on unlocked challenges
            if (!this.classList.contains('locked')) {
                // Remove active class from all challenges
                challengeItems.forEach(item => item.classList.remove('active'));
                
                // Add active class to clicked challenge
                this.classList.add('active');
                
                // Update current challenge
                teamState.currentChallenge = challengeId;
                
                // Show the corresponding challenge screen
                showChallengeScreen(challengeId);
            }
        });
    });
}

// Show a specific challenge screen
function showChallengeScreen(challengeId) {
    // Hide all challenge screens
    const challengeScreens = document.querySelectorAll('.challenge-screen');
    challengeScreens.forEach(screen => screen.classList.remove('active'));
    
    // Show the selected challenge screen
    const selectedScreen = document.getElementById(challengeId);
    if (selectedScreen) {
        selectedScreen.classList.add('active');
    }
}

// Initialize form submissions
function initFormSubmissions() {
    // Add submit event listeners to all challenge forms
    for (const challengeId in challengeData) {
        const form = document.getElementById(`${challengeId}-form`);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get the answer input
                const answerInput = document.getElementById(`${challengeId}-answer`);
                const submittedAnswer = answerInput.value.trim();
                
                // Check if the answer is correct
                checkAnswer(challengeId, submittedAnswer);
            });
        }
        
        // Add hint button functionality
        const hintButton = document.querySelector(`#${challengeId}-form .btn-hint`);
        if (hintButton) {
            hintButton.addEventListener('click', function() {
                requestHint(challengeId);
            });
        }
    }
}

// Check if the submitted answer is correct
function checkAnswer(challengeId, submittedAnswer) {
    const challenge = challengeData[challengeId];
    
    if (submittedAnswer === challenge.answer) {
        // Mark challenge as completed
        completeChallenge(challengeId);
    } else {
        // Show incorrect answer message
        showError("Incorrect answer. Please try again.", "Incorrect Answer");
    }
}

// Mark a challenge as completed
function completeChallenge(challengeId) {
    const challenge = challengeData[challengeId];
    
    // Calculate points (including time bonus)
    let points = challenge.points;
    
    // Apply hint penalty if hints were used
    if (teamState.hintsUsed[challengeId]) {
        points = Math.floor(points * 0.8); // 20% penalty for using hints
    }
    
    // Send completion to server
    fetch(`/api/teams/${teamState.id}/complete-challenge`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            challengeId: challengeId,
            points: points
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success === false) {
            // Challenge was already completed
            showInfo(`You've already completed the "${challenge.title}" challenge.`, "Challenge Already Completed");
            return;
        }
        
        // Update local state with server data
        if (data.team) {
            teamState.score = data.team.score;
            
            // Update score display
            document.getElementById('team-score').textContent = `Score: ${teamState.score}`;
            
            // Add to completed challenges if not already included
            if (!teamState.completedChallenges.includes(challengeId)) {
                teamState.completedChallenges.push(challengeId);
                
                // Update challenge list in UI
                updateChallengeList(challengeId);
                
                // Update team data in session storage
                updateTeamStorage();
                
                // Show success message
                showSuccess(`Congratulations! You've completed the "${challenge.title}" challenge and earned ${points} points.`, "Challenge Completed");
                
                // Update top teams in sidebar
                updateTopTeams();
                
                // If all challenges are completed, show completion screen
                if (teamState.completedChallenges.length === Object.keys(challengeData).length) {
                    showCompletionScreen();
                }
            }
        }
    })
    .catch(error => {
        console.error('Error completing challenge:', error);
        showError('Error saving your progress. Please try again.', 'Error');
    });
}

// Update team data in session storage
function updateTeamStorage() {
    const teamData = JSON.parse(sessionStorage.getItem('currentTeam'));
    if (teamData) {
        teamData.score = teamState.score;
        teamData.completedChallenges = teamState.completedChallenges;
        teamData.hintsUsed = teamState.hintsUsed;
        sessionStorage.setItem('currentTeam', JSON.stringify(teamData));
    }
}

// Update top teams in sidebar
function updateTopTeams() {
    fetch('/api/top-teams?limit=3')
        .then(response => response.json())
        .then(teams => {
            const leaderboardList = document.querySelector('.leaderboard-list');
            if (leaderboardList) {
                // Clear current list
                leaderboardList.innerHTML = '';
                
                // Add top teams
                teams.forEach((team, index) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `${team.name} <span class="points">${team.score} pts</span>`;
                    leaderboardList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching top teams:', error);
        });
}

// Update the challenge list to reflect completed and unlocked challenges
function updateChallengeList(completedChallengeId) {
    // Mark the completed challenge in the list
    const completedItem = document.querySelector(`.challenge-item[data-challenge="${completedChallengeId}"]`);
    completedItem.classList.remove('active');
    completedItem.classList.add('completed');
    completedItem.querySelector('.challenge-status').textContent = 'Completed';
    completedItem.querySelector('.challenge-status').className = 'challenge-status completed';
}

// This function is no longer needed as all challenges are unlocked from the start
// Kept for reference or future use
function unlockNextChallenges(nextChallengeIds) {
    // All challenges are already unlocked
}

// Request a hint for a challenge
function requestHint(challengeId) {
    // Confirm hint request (will reduce points)
    modal.confirm(
        "Requesting a hint will reduce the points for this challenge by 20%. Are you sure?",
        "Confirm Hint Request",
        () => {
        // Mark hint as used for this challenge
        teamState.hintsUsed[challengeId] = true;
        
        // Update team data in session storage
        updateTeamStorage();
        
        // In a real implementation, this would fetch the hint from the server
        let hint = "No hint available for this challenge.";
        
        switch (challengeId) {
            case "challenge1":
                hint = "Each 8-bit binary sequence represents a single ASCII character. Try using an online binary to ASCII converter.";
                break;
            case "challenge2":
                hint = "Match each device description with its common network symbol. Pay attention to which OSI layer each device operates at.";
                break;
            case "challenge3":
                hint = "Try combining an IT term with a month name, and carefully select numbers that add up to 25 (like 7+9+9 or 5+2+0+9+9).";
                break;
            case "challenge4":
                hint = "Remember the different categories: 1xx (Informational), 2xx (Success), 3xx (Redirection), 4xx (Client Error), and 5xx (Server Error).";
                break;
            case "challenge5":
                hint = "Select the commits in chronological order (by date) to reveal the highlighted letters in the correct sequence.";
                break;
            case "challenge6":
                hint = "Focus on the distinctive colors and shapes of each logo. Some logos are simplified versions of the actual logos.";
                break;
            case "challenge7":
                hint = "Check the function declaration syntax, comparison operators, return statements in the map function, and loop bounds.";
                break;
            case "challenge8":
                hint = "For the across clues, think about Python, arrays, routers, agile methodology, relational databases, bugs, and the internet.";
                break;
            case "challenge9":
                hint = "Think about what each emoji could symbolize in a tech context. Consider how emojis can represent programming concepts, hardware, and software.";
                break;
            case "challenge10":
                hint = "Consider the chronological order of major tech innovations. Think about when the internet, smartphones, and cloud computing were introduced.";
                break;
            case "challenge11":
                hint = "Look for patterns and letter frequencies. In English, the most common letters are E, T, A, O, I, N. Try decoding shorter words first like 'THE' and 'AND'.";
                break;
        }
        
        // Display the hint
        showInfo(`${hint}`, "Hint");
        }
    );
}

// Show the completion screen
function showCompletionScreen() {
    // Hide all challenge screens
    const challengeScreens = document.querySelectorAll('.challenge-screen');
    challengeScreens.forEach(screen => screen.classList.remove('active'));
    
    // Show the completion screen
    const completionScreen = document.getElementById('completion-screen');
    completionScreen.classList.add('active');
    
    // Calculate time taken
    const now = new Date();
    const timeTaken = now - teamState.startTime;
    const hours = Math.floor(timeTaken / (1000 * 60 * 60));
    const minutes = Math.floor((timeTaken % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeTaken % (1000 * 60)) / 1000);
    
    // Update final score and time taken
    document.getElementById('final-score').textContent = teamState.score;
    document.getElementById('time-taken').textContent = `${hours}h ${minutes}m ${seconds}s`;
}