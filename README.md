# Flappy Bird

A modern web-based implementation of the classic Flappy Bird game with user authentication and score tracking features.

## Overview

This project is a web-based recreation of the popular Flappy Bird game, enhanced with modern features including user authentication, score tracking, and responsive design. Players can create accounts, sign in, and compete for high scores while enjoying smooth gameplay mechanics.

## Features

- Classic Flappy Bird gameplay mechanics
- Smooth animations and responsive controls
- Dynamic pipe generation with collision detection
- Real-time score tracking
- High score persistence
- Game state management (waiting, playing, game over)

## Project Structure

```
Flappy_Bird/
├── index.html              # Main landing page
├── README.md               # Project documentation
├── fonts/                  # Font assets
├── img/                    # Game images and assets
├── js/                     # JavaScript modules
│   ├── auth.js              # Authentication management
│   ├── game.js              # Core game logic
│   └── script.js            # Homepage interactions
├── pages/                  # HTML pages
│   ├── game.html            # Game interface
│   ├── signin.html          # User sign-in page
│   └── signup.html          # User registration page
└── styles/                 # CSS stylesheets
    ├── auth.css             # Authentication page styles
    ├── game.css             # Game interface styles
    └── style.css            # Homepage styles
```

## Usage

### Getting Started

1. **Homepage**: Navigate to the main page to access game options
2. **Create Account**: Click "Sign In" then navigate to "Sign Up" to create a new account
3. **Authentication**: Sign in with your credentials
4. **Play Game**: Click "START" to begin playing
5. **View Instructions**: Click "How to Play" for game rules and controls

### Gameplay Rules

1. Guide the bird through gaps between pipes
2. Each successful passage scores one point
3. Avoid collision with pipes or ground
4. Try to beat your high score
5. High scores are automatically saved to your account

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request
