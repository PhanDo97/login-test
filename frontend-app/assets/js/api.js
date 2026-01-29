// API Service

class ApiService {
    // Register
    static async register(username, email, password) {
        try {
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
                method: 'POST',
                headers: createHeaders(false),
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'Registration failed');
            }
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: handleApiError(error, 'Unable to register')
            };
        }
    }

    // Login
    static async login(username, password) {
        try {
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
                method: 'POST',
                headers: createHeaders(false),
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'Login failed');
            }
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: handleApiError(error, 'Unable to login')
            };
        }
    }
    
    // Verify token
    static async verifyToken(token) {
        try {
            const response = await fetch(
                `${getApiUrl(API_CONFIG.ENDPOINTS.VERIFY)}?token=${encodeURIComponent(token)}`,
                {
                    method: 'GET',
                    headers: createHeaders(false)
                }
            );
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Token is invalid');
            }
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: handleApiError(error, 'Unable to verify token')
            };
        }
    }
    
    // Get current user information
    static async getCurrentUser(token) {
        try {
            const response = await fetch(
                `${getApiUrl(API_CONFIG.ENDPOINTS.ME)}?token=${encodeURIComponent(token)}`,
                {
                    method: 'GET',
                    headers: createHeaders(false)
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'Unable to get user information');
            }
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: handleApiError(error, 'Unable to get user information')
            };
        }
    }
}