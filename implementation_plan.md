# CTF Treasure Hunt - Implementation Plan

## Event Overview

The CTF Treasure Hunt is a technical challenge event designed for IT professionals at ING. This event combines technical puzzles, coding challenges, and problem-solving tasks in a competitive format. Participants will work in teams to solve a series of increasingly difficult challenges, earning points and advancing through the treasure hunt.

## Event Format

- **Duration**: 1 hour (eg 6:00 PM - 7:00 PM)
- **Location**: Online or in-office (flexible)
- **Team Structure**: Teams of 3-5 members
- **Challenge Structure**: Sequential progression with some parallel paths
- **Post-Event**: Pizza and drinks celebration

## Challenge Progression

The treasure hunt consists of 8 main challenges that test different technical skills:

1. **The Hidden Message** (Cryptography) - Decode a binary message
2. **Network Puzzle** (Networking) - Identify network devices from descriptions
3. **Password Strength** (Security) - Create a secure password meeting specific requirements
4. **HTTP Status Codes** (Web Development) - Match HTTP status codes with descriptions
5. **Git Mystery** (Version Control) - Find a secret in Git commit history
6. **Tech Logo Quiz** (Tech Culture) - Identify tech companies from partial logos
7. **Debug the Code** (Development) - Find and fix bugs in a JavaScript function
8. **IT Crossword Puzzle** (General IT Knowledge) - Complete a crossword with IT terms

The challenges follow this progression path:
```
Challenge 1 → Challenge 2 → Challenge 3 → Challenge 4 → Challenge 6 → Challenge 7 → Challenge 8
                                       ↘ Challenge 5 ↗
```

## Implementation Details

### Website Setup

1. **Hosting**: Deploy the website on your company's internal server or use a cloud service like AWS, Azure, or GitHub Pages.
2. **Domain**: Use a subdomain of your company domain (e.g., treasurehunt.ing-tech.com) or a custom domain.
3. **Authentication**: Implement a simple authentication system using company email addresses.

### Challenge Platform

The treasure hunt platform consists of:

1. **Public Website**: Information, rules, registration, and leaderboard (index.html)
2. **Challenge Portal**: Secure area where teams access challenges after login
3. **Admin Dashboard**: For organizers to monitor progress and provide hints

### Technical Implementation

#### 1. Challenge Delivery

Each challenge is delivered through an interactive web interface:

- HTML/JavaScript interactive challenges for most puzzles
- Text files (.txt) for the binary message and Git challenges
- Interactive forms for password creation and validation
- Drag-and-drop interfaces for matching exercises

#### 2. Answer Validation

Implement a simple answer validation system:
- Each challenge has a specific password/solution
- Teams enter the solution on the challenge page
- Correct solutions unlock the next challenge
- System logs completion time for scoring

#### 3. Scoring System

The scoring system includes:
- Base points for each challenge (100-300 points based on difficulty)
- Time bonus (faster completion = more points)
- Hint penalty (using hints reduces points)

#### 4. Leaderboard

Real-time leaderboard showing:
- Team rankings
- Challenges completed
- Total points
- Time taken

## Technical Requirements

### Server Requirements

- Web server (Apache, Nginx)
- Database for user accounts and progress tracking (MySQL, PostgreSQL)
- Node.js for backend functionality
- Git repository for the Git challenge

### Client Requirements

Participants will need:
- Modern web browser
- Git client (only for the Git challenge)
- No specialized development tools required for most challenges

## Setup Instructions

### 1. Website Deployment

1. Upload the website files to your hosting environment
2. Configure the web server to serve the static files
3. Set up SSL for secure connections

### 2. Challenge Setup

1. Create a secure area for the challenge files
2. Set up the progression system to unlock challenges sequentially
3. Implement the answer validation system
4. Create the Git repository for the Git challenge

### 3. User Management

1. Set up the registration system
2. Implement team creation and management
3. Configure authentication using company email addresses

## Event Timeline

### Pre-Event

- **4 Weeks Before**: Finalize challenge content and test solutions
- **3 Weeks Before**: Deploy website and test platform
- **2 Weeks Before**: Open registration and promote the event
- **1 Week Before**: Close registration and finalize teams

### Event Day

- **5:30 PM**: Open virtual meeting room or physical venue
- **6:00 PM**: Event kickoff and rules explanation
- **6:15 PM**: Start the treasure hunt
- **10:00 PM**: End the treasure hunt
- **10:15 PM**: Announce winners and distribute prizes
- **10:30 PM**: Social time with pizza and drinks

## Prizes and Recognition

Suggested prizes:
- **1st Place**: Hoodies + gift cards
- **2nd Place**: T-shirts + gift cards
- **3rd Place**: Socks + gift cards
- **Participation**: Small swag items for all participants

## Contingency Plans

1. **Technical Issues**: Have a backup system ready and technical support available
2. **Hint System**: Prepare progressive hints for each challenge if teams get stuck
3. **Time Extensions**: Be prepared to extend time for specific challenges if needed

## Post-Event

1. **Feedback Collection**: Survey participants for feedback
2. **Solution Sharing**: Share solutions and explanations after the event
3. **Recognition**: Highlight winners in company newsletter or intranet

## Resources Needed

1. **Personnel**:
   - Event coordinator
   - Technical support (1-2 people)
   - Challenge validators (can be automated)

2. **Budget Items**:
   - Website hosting
   - Prizes
   - Food and drinks
   - Marketing materials

## Customization Options

This treasure hunt can be customized in several ways:

1. **Difficulty Level**: Adjust challenge complexity based on participant skill levels
2. **Duration**: Extend to a multi-day event for more challenges
3. **Theme**: Add a storyline or theme to connect the challenges
4. **Technology Focus**: Emphasize specific technologies relevant to your teams

## Challenge Design Principles

The challenges have been designed with the following principles in mind:

1. **Accessibility**: Challenges are accessible to participants with varied technical backgrounds, not just developers
2. **Visual Interaction**: Most challenges use visual/interactive web interfaces rather than requiring code downloads
3. **Balanced Difficulty**: Challenges progress from easy to more difficult, but remain solvable within the time frame
4. **Diverse Skills**: Challenges test a wide range of IT knowledge, not just programming skills
5. **Fun Factor**: Challenges incorporate elements of fun and discovery to keep participants engaged

## Conclusion

This implementation plan provides a comprehensive framework for organizing the CTF Treasure Hunt. The modular design allows for flexibility in deployment and customization based on your specific requirements and constraints.

By following this plan, you can create an engaging and challenging event that promotes technical skills, teamwork, and a fun competitive atmosphere among your colleagues.