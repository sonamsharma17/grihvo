
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/super-admin';

// Types
export interface SuperAdminStats {
    totalUsers: number;
    totalVendors: number;
    totalProducts: number;
    totalOrders: number;
    pendingApprovals: number;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
}

export interface Business {
    _id: string;
    businessName: string;
    category: string;
    status: string;
    ownerName: string;
    createdAt: string;
}

// Get dashboard stats
export const getSuperAdminStats = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get recent users
export const getRecentUsers = async (limit = 5) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/recent-users?limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get recent businesses
export const getRecentBusinesses = async (limit = 5) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/recent-businesses?limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
// Get all users
export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
// Create new user
export const createUser = async (userData: any) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/users`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get pending products
export const getPendingProducts = async (page = 1, limit = 20) => {
    try {
        const token = localStorage.getItem('token');
        // Use products endpoint
        const response = await axios.get(`http://localhost:5000/api/products/admin/pending?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update product status
export const updateProductStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`http://localhost:5000/api/products/${id}/status`, { status }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
