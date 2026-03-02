import api from './axiosConfig';

export interface SignupData {
    name: string;
    email?: string;
    phone: string;
    password: string;
}

export interface LoginData {
    phone: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: string;
        name: string;
        email?: string;
        phone: string;
        role?: string;
        businessId?: string;
    };
}

// Signup service
export const signup = async (data: SignupData): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/auth/signup', data);

        // Store token and user data in localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            if (response.data.user?.role) {
                localStorage.setItem('userRole', response.data.user.role);
            }
            if (response.data.user?.businessId) {
                localStorage.setItem('businessId', response.data.user.businessId);
            }
        }

        return response.data;
    } catch (error: any) {
        throw error.response?.data || { success: false, message: 'Signup failed' };
    }
};

// Login service
export const login = async (data: LoginData): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/auth/login', data);

        // Store token and user data in localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            if (response.data.user?.role) {
                localStorage.setItem('userRole', response.data.user.role);
            }
            if (response.data.user?.businessId) {
                localStorage.setItem('businessId', response.data.user.businessId);
            }
        }

        return response.data;
    } catch (error: any) {
        throw error.response?.data || { success: false, message: 'Login failed' };
    }
};

// Logout service
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('businessId');
};

// Get current user from localStorage
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
};

// Get user role
export const getUserRole = (): string | null => {
    return localStorage.getItem('userRole');
};

// Get business ID
export const getBusinessId = (): string | null => {
    return localStorage.getItem('businessId');
};

// Check if user is vendor (admin or superadmin)
export const isVendor = (): boolean => {
    const role = getUserRole();
    return role === 'admin' || role === 'superadmin';
};
