/**
 * Dashboard Page Logic
 */

// Get elements
const userNameElement = document.getElementById('userName');
const userEmailElement = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

// Logout and redirect to login page
function logout() {
    clearAuth();
    window.location.href = 'login.html';
}

// Display user information
function displayUserInfo(userData) {
    userNameElement.textContent = userData.username || 'User';
    userEmailElement.textContent = userData.email || 'user@example.com';
}

// Check authentication
async function checkAuth() {
    const token = getToken();
    
    if (!token) {
        // No token, redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Verify token with backend
        const result = await ApiService.verifyToken(token);
        
        if (result.success) {
            // Token is valid, display user information
            displayUserInfo(result.data);
        } else {
            // Token is invalid, logout
            logout();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        
        // If unable to connect to server, still display information from localStorage
        const userData = getUserData();
        if (userData) {
            displayUserInfo(userData);
        } else {
            logout();
        }
    }
}

// Load dashboard data
async function loadDashboardData() {
    console.log('Dashboard data loaded');
}

// Event listener for logout button
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        logout();
    }
});

// Check auth when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadDashboardData();
});

// Prevent back button after logout
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was loaded from cache (back button)
        checkAuth();
    }
});
