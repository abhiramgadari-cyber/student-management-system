// Authentication System - Login/Register

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    checkAuth();

    // Setup event listeners
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Forgot password
    const forgotLink = document.querySelector('.forgot-password');
    if (forgotLink) {
        forgotLink.addEventListener('click', handleForgotPassword);
    }
});

// Check if user is authenticated
function checkAuth() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const user = JSON.parse(localStorage.getItem('currentUser'));

    // If not on login/register page and not logged in, redirect to login
    if (currentPage === 'index.html' && !user) {
        window.location.href = 'login.html';
    }

    // If on login/register page and logged in, redirect to dashboard
    if ((currentPage === 'login.html' || currentPage === 'register.html') && user) {
        window.location.href = 'index.html';
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Clear previous errors
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    // Validation
    let isValid = true;

    if (!email.includes('@')) {
        document.getElementById('emailError').textContent = 'Please enter a valid email';
        isValid = false;
    }

    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }

    if (!isValid) return;

    // Get all users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        // For demo purposes, allow demo login
        if (email === 'demo@example.com' && password === 'password123') {
            const demoUser = {
                id: 'demo-user',
                email: 'demo@example.com',
                name: 'Demo User',
                loginTime: new Date().toLocaleString()
            };
            localStorage.setItem('currentUser', JSON.stringify(demoUser));
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            showNotification('Login successful!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            document.getElementById('emailError').textContent = 'Invalid email or password';
        }
    } else {
        // User found
        const userObj = {
            id: user.id,
            email: user.email,
            name: user.name,
            loginTime: new Date().toLocaleString()
        };
        localStorage.setItem('currentUser', JSON.stringify(userObj));
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        showNotification('Login successful!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Handle Registration
function handleRegister(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Clear previous errors
    document.getElementById('fullNameError').textContent = '';
    document.getElementById('registerEmailError').textContent = '';
    document.getElementById('registerPasswordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';

    // Validation
    let isValid = true;

    if (fullName.length < 3) {
        document.getElementById('fullNameError').textContent = 'Name must be at least 3 characters';
        isValid = false;
    }

    if (!email.includes('@')) {
        document.getElementById('registerEmailError').textContent = 'Please enter a valid email';
        isValid = false;
    }

    if (password.length < 8) {
        document.getElementById('registerPasswordError').textContent = 'Password must be at least 8 characters';
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        isValid = false;
    }

    if (!agreeTerms) {
        showNotification('Please agree to the Terms & Conditions', 'error');
        isValid = false;
    }

    if (!isValid) return;

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === email)) {
        document.getElementById('registerEmailError').textContent = 'Email already registered';
        return;
    }

    // Create new user
    const newUser = {
        id: 'user-' + Date.now(),
        name: fullName,
        email: email,
        password: password,
        registeredDate: new Date().toLocaleString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login
    const userObj = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        loginTime: new Date().toLocaleString()
    };
    localStorage.setItem('currentUser', JSON.stringify(userObj));

    showNotification('Account created successfully!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

function toggleRegisterPassword() {
    const passwordInput = document.getElementById('registerPassword');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

function toggleConfirmPassword() {
    const confirmInput = document.getElementById('confirmPassword');
    const type = confirmInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmInput.setAttribute('type', type);
}

// Handle Forgot Password
function handleForgotPassword(e) {
    e.preventDefault();
    const email = prompt('Enter your email address:');
    if (email) {
        showNotification('Password reset link sent to ' + email);
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberMe');
        showNotification('Logged out successfully!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? '#dc3545' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations if not already present
if (!document.querySelector('style[data-auth]')) {
    const style = document.createElement('style');
    style.setAttribute('data-auth', 'true');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
