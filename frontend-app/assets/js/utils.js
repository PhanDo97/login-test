//Common utility functions

//  Storage Utilities 

// Save data to localStorage
const saveToStorage = (key, value) => {
    try {
        const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
        return true;
    } catch (error) {
        console.error('Error saving to storage:', error);
        return false;
    }
};

// Get data from localStorage
const getFromStorage = (key, parseJson = false) => {
    try {
        const value = localStorage.getItem(key);
        if (!value) return null;
        
        return parseJson ? JSON.parse(value) : value;
    } catch (error) {
        console.error('Error reading from storage:', error);
        return null;
    }
};

// Remove data from localStorage
const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from storage:', error);
        return false;
    }
};

//  Token Utilities 

// Save token
const saveToken = (token, userData = null) => {
    saveToStorage(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
    if (userData) {
        saveToStorage(API_CONFIG.STORAGE_KEYS.USER_DATA, userData);
    }
};

// Get token
const getToken = () => {
    return getFromStorage(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
};

// Get user information
const getUserData = () => {
    return getFromStorage(API_CONFIG.STORAGE_KEYS.USER_DATA, true);
};

// Clear token and user data (logout)
const clearAuth = () => {
    removeFromStorage(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    removeFromStorage(API_CONFIG.STORAGE_KEYS.USER_DATA);
};

// UI Utilities 

// Show alert
const showAlert = (elementId, message, type = 'error', duration = 5000) => {
    const alertElement = document.getElementById(elementId);
    if (!alertElement) return;
    
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type}`;
    alertElement.style.display = 'block';
    
    if (duration > 0) {
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, duration);
    }
};

// Hide alert
const hideAlert = (elementId) => {
    const alertElement = document.getElementById(elementId);
    if (alertElement) {
        alertElement.style.display = 'none';
    }
};

// Show loading state on button
const setButtonLoading = (buttonElement, isLoading, loadingText = 'Processing...') => {
    if (isLoading) {
        buttonElement.dataset.originalText = buttonElement.textContent;
        buttonElement.innerHTML = `<span class="loader"></span> ${loadingText}`;
        buttonElement.disabled = true;
    } else {
        buttonElement.textContent = buttonElement.dataset.originalText || buttonElement.textContent;
        buttonElement.disabled = false;
    }
};

// API Utilities 

// Create headers for API request
const createHeaders = (includeAuth = false) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (includeAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    return headers;
};

// Handle API errors
const handleApiError = (error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error);
    
    if (error.message === 'Failed to fetch') {
        return 'Cannot connect to the server. Please check your connection!';
    }
    
    return error.detail || error.message || defaultMessage;
};


// Export for usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveToStorage,
        getFromStorage,
        removeFromStorage,
        saveToken,
        getToken,
        getUserData,
        clearAuth,
        showAlert,
        hideAlert,
        setButtonLoading,
        createHeaders,
        handleApiError,
    };
}
