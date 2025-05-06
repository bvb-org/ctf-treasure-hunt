document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timer
    initCountdown();
    
    // Initialize registration form
    initRegistrationForm();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Initialize leaderboard with sample data (for demo purposes)
    initLeaderboard();
});

// Countdown Timer
function initCountdown() {
    // Fetch hunt configuration from the server
    fetch('/api/admin/config')
        .then(response => response.json())
        .then(config => {
            if (!config.start_time) {
                document.getElementById("countdown-timer").innerHTML = "<h3>Hunt not configured yet</h3>";
                return;
            }
            
            // Set up countdown interval
            startCountdown(config);
        })
        .catch(error => {
            console.error('Error fetching hunt configuration:', error);
            
            // Check if the hunt might be over by looking at the current time
            // and comparing it with the expected hunt end time from localStorage if available
            const savedConfig = localStorage.getItem('huntConfig');
            if (savedConfig) {
                try {
                    const config = JSON.parse(savedConfig);
                    const now = new Date().getTime();
                    const startTime = new Date(config.start_time).getTime();
                    const endTime = startTime + (config.duration_minutes * 60000);
                    
                    if (now > endTime) {
                        // Hunt is over
                        document.getElementById("countdown-timer").innerHTML = "<h3>The Hunt Has Ended!</h3>";
                        
                        // Disable the start button
                        const startHuntBtn = document.getElementById('start-hunt-btn');
                        if (startHuntBtn) {
                            startHuntBtn.classList.add('disabled');
                            startHuntBtn.style.pointerEvents = 'none';
                            startHuntBtn.style.opacity = '0.5';
                        }
                        return;
                    }
                } catch (e) {
                    console.error('Error parsing saved hunt config:', e);
                }
            }
            
            // If we couldn't determine the hunt status, show the error
            document.getElementById("countdown-timer").innerHTML = "<h3>Error loading countdown</h3>";
            
            // Disable the start button as a precaution
            const startHuntBtn = document.getElementById('start-hunt-btn');
            if (startHuntBtn) {
                startHuntBtn.classList.add('disabled');
                startHuntBtn.style.pointerEvents = 'none';
                startHuntBtn.style.opacity = '0.5';
            }
        });
}

function startCountdown(config) {
    // Get the start time from the configuration
    const eventDate = new Date(config.start_time);
    
    // Save the hunt configuration to localStorage for error recovery
    localStorage.setItem('huntConfig', JSON.stringify(config));
    
    const countdownFunction = function() {
        // Get current date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the countdown date
        const distance = eventDate - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        document.getElementById("days").textContent = formatTime(days);
        document.getElementById("hours").textContent = formatTime(hours);
        document.getElementById("minutes").textContent = formatTime(minutes);
        document.getElementById("seconds").textContent = formatTime(seconds);
        
        // If the countdown is finished, display countdown until hunt ends and enable the start button
        if (distance < 0) {
            clearInterval(countdownInterval);
            
            // Calculate end time (start time + duration)
            const endTime = new Date(eventDate.getTime() + (config.duration_minutes * 60000));
            const timeUntilEnd = endTime - now;
            
            if (timeUntilEnd <= 0) {
                // Hunt is over
                document.getElementById("countdown-timer").innerHTML = "<h3>The Hunt Has Ended!</h3>";
                
                // Disable the start button
                const startHuntBtn = document.getElementById('start-hunt-btn');
                if (startHuntBtn) {
                    startHuntBtn.classList.add('disabled');
                    startHuntBtn.style.pointerEvents = 'none';
                    startHuntBtn.style.opacity = '0.5';
                }
            } else {
                // Hunt is active, show countdown until end
                const hoursLeft = Math.floor(timeUntilEnd / (1000 * 60 * 60));
                const minutesLeft = Math.floor((timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60));
                const secondsLeft = Math.floor((timeUntilEnd % (1000 * 60)) / 1000);
                
                document.getElementById("days").textContent = "00";
                document.getElementById("hours").textContent = formatTime(hoursLeft);
                document.getElementById("minutes").textContent = formatTime(minutesLeft);
                document.getElementById("seconds").textContent = formatTime(secondsLeft);
                
                // Add a label to indicate this is time until hunt ends
                const countdownElement = document.querySelector('.countdown');
                if (countdownElement) {
                    const huntEndLabel = document.createElement('div');
                    huntEndLabel.className = 'hunt-end-label';
                    huntEndLabel.textContent = 'Time until hunt ends:';
                    huntEndLabel.style.textAlign = 'center';
                    huntEndLabel.style.marginBottom = '10px';
                    huntEndLabel.style.fontWeight = 'bold';
                    
                    // Only add the label if it doesn't exist yet
                    if (!document.querySelector('.hunt-end-label')) {
                        countdownElement.insertBefore(huntEndLabel, document.getElementById('countdown-timer'));
                    }
                }
                
                // Enable the start button
                const startHuntBtn = document.getElementById('start-hunt-btn');
                if (startHuntBtn) {
                    startHuntBtn.classList.remove('disabled');
                    startHuntBtn.style.pointerEvents = 'auto';
                    startHuntBtn.style.opacity = '1';
                }
                
                // Continue updating the countdown
                setTimeout(countdownFunction, 1000);
            }
        } else {
            // Disable the start button while countdown is active
            const startHuntBtn = document.getElementById('start-hunt-btn');
            if (startHuntBtn) {
                startHuntBtn.classList.add('disabled');
                startHuntBtn.style.pointerEvents = 'none';
                startHuntBtn.style.opacity = '0.5';
            }
        }
    };
    
    // Format time to always have two digits
    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }
    
    // Run the function once immediately
    countdownFunction();
    
    // Update the countdown every 1 second
    const countdownInterval = setInterval(countdownFunction, 1000);
}

// Registration Link
function initRegistrationForm() {
    const registrationLink = document.getElementById('registration-link');
    
    if (registrationLink) {
        registrationLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Fetch teams data from the database
            fetch('/api/teams')
                .then(response => response.json())
                .then(teams => {
                    // Create a modal to display team options
                    showTeamSelectionModal(teams);
                })
                .catch(error => {
                    console.error('Error fetching teams data:', error);
                    showError('Error loading teams. Please try again later.', 'Error');
                });
        });
    }
}

// Show team selection modal
function showTeamSelectionModal(teams) {
    console.log('Creating team selection modal with teams:', teams);
    // If teams is not an array, handle the error
    if (!Array.isArray(teams)) {
        console.error('Teams data is not an array:', teams);
        showError('Error loading teams. Please try again later.', 'Error');
        return;
    }
    
    // Create modal overlay (following the structure in modal.css)
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h3');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = 'Select Your Team';
    
    modalHeader.appendChild(modalTitle);
    
    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    // Create team list
    const teamList = document.createElement('div');
    teamList.className = 'team-list';
    teamList.style.display = 'grid';
    teamList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    teamList.style.gap = '15px';
    teamList.style.marginBottom = '20px';
    
    teams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.style.border = '1px solid #ddd';
        teamCard.style.borderRadius = '4px';
        teamCard.style.padding = '15px';
        teamCard.style.cursor = 'pointer';
        teamCard.style.transition = 'background-color 0.3s';
        
        teamCard.addEventListener('mouseover', () => {
            teamCard.style.backgroundColor = '#f5f5f5';
        });
        
        teamCard.addEventListener('mouseout', () => {
            teamCard.style.backgroundColor = '#fff';
        });
        
        teamCard.addEventListener('click', () => {
            console.log('Team card clicked, redirecting to:', `/${team.id}`);
            window.location.href = `/${team.id}`;
        });
        
        const teamName = document.createElement('h3');
        teamName.textContent = team.name;
        teamName.style.margin = '0 0 10px 0';
        teamName.style.color = '#333';
        
        teamCard.appendChild(teamName);
        teamList.appendChild(teamCard);
    });
    
    modalBody.appendChild(teamList);
    
    // Create modal footer
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-btn modal-btn-secondary';
    closeButton.textContent = 'Close';
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });
    
    modalFooter.appendChild(closeButton);
    
    // Assemble modal
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalBody);
    modalContainer.appendChild(modalFooter);
    modalOverlay.appendChild(modalContainer);
    
    // Add modal to body
    document.body.appendChild(modalOverlay);
    
    // Make the modal visible by adding the active class
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 300); // Wait for transition to complete
        }
    });
    
    // Add keydown event to close modal on Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            modalOverlay.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
                document.removeEventListener('keydown', escapeHandler);
            }, 300);
        }
    };
    
    document.addEventListener('keydown', escapeHandler);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Real Leaderboard Data from API
function initLeaderboard() {
    const leaderboardTable = document.getElementById('leaderboard-table');
    if (!leaderboardTable) return;
    
    const tbody = leaderboardTable.querySelector('tbody');
    
    // Add loading indicator
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Loading leaderboard data...</td></tr>';
    
    // Fetch leaderboard data from API
    fetch('/api/leaderboard')
        .then(response => response.json())
        .then(teams => {
            // Clear loading indicator
            tbody.innerHTML = '';
            
            // Populate the table
            teams.forEach((team, index) => {
                const rank = index + 1;
                const row = document.createElement('tr');
                
                // Add rank cell with styling based on position
                const rankCell = document.createElement('td');
                rankCell.textContent = rank;
                if (rank <= 3) {
                    rankCell.style.fontWeight = 'bold';
                    if (rank === 1) rankCell.style.color = 'gold';
                    if (rank === 2) rankCell.style.color = 'silver';
                    if (rank === 3) rankCell.style.color = '#cd7f32'; // bronze
                }
                row.appendChild(rankCell);
                
                // Add other cells
                const teamCell = document.createElement('td');
                teamCell.textContent = team.name;
                row.appendChild(teamCell);
                
                const completedCell = document.createElement('td');
                completedCell.textContent = team.completed_challenges || 0;
                row.appendChild(completedCell);
                
                // Format time from last_completion
                const timeCell = document.createElement('td');
                if (team.last_completion) {
                    const completionDate = new Date(team.last_completion);
                    const now = new Date();
                    const timeDiff = now - completionDate;
                    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                    timeCell.textContent = `${hours}h ${minutes}m`;
                } else {
                    timeCell.textContent = '-';
                }
                row.appendChild(timeCell);
                
                const pointsCell = document.createElement('td');
                pointsCell.textContent = team.score;
                pointsCell.style.fontWeight = 'bold';
                row.appendChild(pointsCell);
                
                tbody.appendChild(row);
            });
            
            // If no teams found
            if (teams.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No teams have scored points yet</td></tr>';
            }
            
            // Set up auto-refresh for leaderboard
            setTimeout(initLeaderboard, 30000); // Refresh every 30 seconds
        })
        .catch(error => {
            console.error('Error fetching leaderboard:', error);
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Error loading leaderboard data</td></tr>';
        });
}