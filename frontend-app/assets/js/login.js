
// Login Page Logic

// Get elements
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const alertBox = document.getElementById('alertBox');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Check if user is already logged in
async function checkAuth() {
    const token = getToken();
    
    if (token) {
        // Verify token with backend
        const result = await ApiService.verifyToken(token);
        
        if (result.success) {
            // Token is valid, redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Token is invalid, clear token
            clearAuth();
        }
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validation
    if (!username) {
        showAlert('alertBox', 'Please enter your username!', 'error');
        usernameInput.focus();
        return;
    }
    if (!password) {
        showAlert('alertBox', 'Please enter your password!', 'error');
        passwordInput.focus();
        return;
    }
    if (password.length < 8) {
        showAlert('alertBox', 'Password must be at least 8 characters long!', 'error');
        passwordInput.focus();
        return;
    }
    // Show loading
    setButtonLoading(loginBtn, true, 'Logging in...');
    hideAlert('alertBox');
    
    try {
        // Call API login
        const result = await ApiService.login(username, password);
        if (result.success) {
            // Login successful
            const { access_token, username: user, email } = result.data;
            // Save token and user data
            saveToken(access_token, { username: user, email });
            // Show success message
            showAlert('alertBox', 'Login successful! Redirecting...', 'success');
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } else {
            // Login failed
            showAlert('alertBox', result.error, 'error');
            setButtonLoading(loginBtn, false);
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('alertBox', 'An error occurred. Please try again!', 'error');
        setButtonLoading(loginBtn, false);
    }
}
// Clear alert when user starts typing
function handleInputChange() {
    hideAlert('alertBox');
}

// Event listeners
loginForm.addEventListener('submit', handleLogin);
usernameInput.addEventListener('input', handleInputChange);
passwordInput.addEventListener('input', handleInputChange);

// Check auth when page loads
document.addEventListener('DOMContentLoaded', checkAuth);

// Focus on username input when page loads
window.addEventListener('load', () => {
    usernameInput.focus();
});
