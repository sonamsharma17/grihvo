import api from './axiosConfig';

// TypeScript Interfaces
export interface DashboardStats {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
}

export interface Order {
    _id: string;
    orderNumber: string;
    businessId: string;
    customerId: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    products: Array<{
        productId: string;
        productName: string;
        quantity: number;
        price: number;
        subtotal: number;
    }>;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    deliveryAddress?: string;
    customerPhone?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface StockAlert {
    _id: string;
    productName: string;
    stock: number;
    category: string;
    images: string[];
}

// Get Dashboard Statistics
export const getDashboardStats = async (): Promise<{ success: boolean; stats: DashboardStats }> => {
    try {
        const response = await api.get('/dashboard/stats');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        };
    }
};

// Get Recent Orders
export const getRecentOrders = async (limit = 10): Promise<{ success: boolean; orders: Order[] }> => {
    try {
        const response = await api.get('/dashboard/recent-orders', {
            params: { limit }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to fetch recent orders',
            error: error.message
        };
    }
};

// Get Stock Alerts
export const getStockAlerts = async (threshold = 10): Promise<{ success: boolean; products: StockAlert[]; count: number }> => {
    try {
        const response = await api.get('/dashboard/stock-alerts', {
            params: { threshold }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to fetch stock alerts',
            error: error.message
        };
    }
};
