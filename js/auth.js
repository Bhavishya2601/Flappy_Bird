class AuthManager {
    constructor() {
        this.usersFile = 'users.json';
        this.initializeUsers();
        this.bindEvents();
    }

    initializeUsers() {
        if (!localStorage.getItem('flappyBirdUsers')) {
            localStorage.setItem('flappyBirdUsers', JSON.stringify([]));
        }
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('flappyBirdUsers') || '[]');
    }

    saveUsers(users) {
        localStorage.setItem('flappyBirdUsers', JSON.stringify(users));
    }

    isLoggedIn() {
        return localStorage.getItem('flappyBirdSession') !== null;
    }

    getCurrentUser() {
        const session = localStorage.getItem('flappyBirdSession');
        return session ? JSON.parse(session) : null;
    }

    isValidEmail(email) {
        email = email.trim();
        
        const basicEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        const invalidChars = /[#^&$%*+={}[\]|\\:";'<>?/~`!]/;
        
        const multipleDots = /\.\./;
        
        const invalidDotPosition = /^\.|\.$|@\.|\.@/;
        
        if (!basicEmailRegex.test(email)) {
            return false;
        }
        
        if (invalidChars.test(email)) {
            return false;
        }
        
        if (multipleDots.test(email)) {
            return false;
        }
        
        if (invalidDotPosition.test(email)) {
            return false;
        }
        
        const parts = email.split('@');
        if (parts.length !== 2) {
            return false;
        }
        
        const [localPart, domainPart] = parts;
        
        if (localPart.length < 1 || localPart.length > 64) {
            return false;
        }
        
        if (domainPart.length < 3 || domainPart.length > 255) {
            return false;
        }
        
        return true;
    }

    isValidUsername(username) {
        username = username.trim();
        
        if (!username || username.length === 0) {
            return false;
        }
        
        if (/^\d+$/.test(username)) {
            return false;
        }
        
        if (username.includes('-') && /^-/.test(username)) {
            return false;
        }
        
        if (username.length < 3) {
            return false;
        }
        
        if (username.length > 20) {
            return false;
        }
        
        if (!/^[a-zA-Z0-9_][a-zA-Z0-9_-]*$/.test(username)) {
            return false;
        }
        
        return true;
    }

    signUp(username, email, password) {
        const errorElement = document.getElementById('errorMessage');

        if (!this.isValidUsername(username)) {
            this.showError('Username must be 3-20 characters, contain letters/numbers/underscore, cannot be only numbers, and cannot start with a hyphen!');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address!');
            return false;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long!');
            return false;
        }

        const users = this.getUsers();

        if (users.find(user => user.username === username)) {
            this.showError('Username already exists!');
            return false;
        }

        if (users.find(user => user.email === email)) {
            this.showError('Email already registered!');
            return false;
        }

        const newUser = {
            id: Date.now(),
            username,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        this.showSuccess('Account created successfully! Redirecting to sign in...');
        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 2000);

        return true;
    }

    signIn(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            this.showError('Invalid username or password!');
            return false;
        }

        const session = {
            id: user.id,
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('flappyBirdSession', JSON.stringify(session));

        this.showSuccess('Sign in successful! Redirecting to game...');
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 1500);

        return true;
    }

    signOut() {
        localStorage.removeItem('flappyBirdSession');
        window.location.href = '../index.html';
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.className = 'error-message';
        }
    }

    showSuccess(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.className = 'success-message';
        }
    }

    bindEvents() {
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(signupForm);
                this.signUp(
                    formData.get('username'),
                    formData.get('email'),
                    formData.get('password')
                );
            });
        }

        const signinForm = document.getElementById('signinForm');
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(signinForm);
                this.signIn(
                    formData.get('username'),
                    formData.get('password')
                );
            });
        }
    }

    updateHighScore(newScore) {
        const currentHighScore = this.getHighScore();
        if (newScore > currentHighScore) {
            localStorage.setItem('flappyBirdHighScore', newScore);
            return true;
        }
        return false;
    }

    getHighScore() {
        return parseInt(localStorage.getItem('flappyBirdHighScore') || '0');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

window.AuthManager = AuthManager;