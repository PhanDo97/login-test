//API Configuration

const API_CONFIG = {
    // Base URL of the Backend API
    BASE_URL: 'http://localhost:8000',
    
    // API Endpoints
    ENDPOINTS: {
        REGISTER: '/api/register',
        LOGIN: '/api/login',
        VERIFY: '/api/verify',
        ME: '/api/me'
    },
    
    // Timeout for requests
    TIMEOUT: 10000,
    
    // Storage keys
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'access_token',
        USER_DATA: 'user_data',
    }
};

// Helper function to get full URL
const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};