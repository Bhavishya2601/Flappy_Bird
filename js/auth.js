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

    signUp(username, email, password) {
        const errorElement = document.getElementById('errorMessage');

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