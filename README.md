# CTF Treasure Hunt

A team-based technical treasure hunt challenge portal for ING's tech teams.

## Features

- Team-based challenge portal with password protection
- Each team has their own URL and login credentials
- All challenges are available from the start (no sequential unlocking)
- Score tracking and leaderboard
- Interactive technical challenges in various IT domains

## Project Structure

- `index.html` - Main landing page with event information and team selection
- `challenge-portal.html` - The main challenge portal interface
- `team-login.html` - Team-specific login page
- `teams.json` - Contains team data including passwords
- `server.js` - Express server to handle team-specific routes
- `js/` - JavaScript files for application functionality
  - `main.js` - Main page functionality
  - `portal.js` - Challenge portal functionality
- `css/` - Stylesheets
- `challenges/` - Challenge files and resources
- `img/` - Images and assets

## Setup and Running

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the Application

Start the server:

```bash
npm start
```

The application will be available at http://localhost:3123

### Team Access

Each team can access their challenge portal through their team-specific URL:

```
http://localhost:3123/[team-id]
```

For example:
- http://localhost:3123/binary-bandits
- http://localhost:3123/code-breakers
- etc.

Teams will need to enter their password to access the challenge portal.

## Team Passwords

The following teams are pre-configured with passwords:

1. Binary Bandits - `B4nd1t5C0d3!`
2. Syntax Error - `Synt4x2025!`
3. Terminal Titans - `T1t4nT3rm!`
4. Firewall Fighters - `F1r3W4ll!`
5. Stack Overflow - `0v3rfl0w!`
6. Null Pointers - `Nu11P01nt!`
7. Git Guardians - `G1tGu4rd!`
8. Code Breakers - `Br34kC0d3!`
9. Data Dragons - `Dr4g0nD4t4!`
10. Quantum Questers - `Qu4ntumQ!`

## Challenges

The treasure hunt includes 8 technical challenges:

1. The Hidden Message (Cryptography)
2. Network Puzzle (Networking)
3. Password Strength (Security)
4. HTTP Status Codes (Web Development)
5. Git Mystery (Version Control)
6. Tech Logo Quiz (Tech Culture)
7. Debug the Code (Development)
8. IT Crossword Puzzle (General IT Knowledge)

## Customization

To add or modify teams, edit the `teams.json` file.

To modify challenges, edit the `challenges/challenges.json` file and corresponding challenge files.

## Deployment to Raspberry Pi

This project can be deployed to a Raspberry Pi using GitHub Actions and Docker.

### Prerequisites for Deployment

1. A Raspberry Pi with Docker installed
2. GitHub Actions self-hosted runner set up on the Raspberry Pi
3. Git repository with this code pushed to GitHub

### Deployment Process

1. The deployment is configured to run via GitHub Actions workflow
2. The workflow is triggered manually from the GitHub Actions tab
3. The application is containerized using Docker
4. The database is persisted between deployments using a volume mount

### Manual Deployment

If you prefer to deploy manually without GitHub Actions:

1. Build the Docker image:
   ```bash
   docker build -t ing-treasure-hunt .
   ```

2. Run the container:
   ```bash
   # Create a Docker volume for database persistence
   docker volume create treasure-hunt-db
   
   # Run the container
   docker run -d \
     --name ing-treasure-hunt \
     --restart unless-stopped \
     -p 3123:3123 \
     -v treasure-hunt-db:/app/data \
     -e DB_PATH=/app/data/treasure_hunt.db \
     ing-treasure-hunt:latest
   ```

3. Access the application at http://[raspberry-pi-ip]:3123
