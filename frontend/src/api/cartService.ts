import api from './axiosConfig';
import { Product } from './productService';

export interface CartItem {
    _id: string;
    productId: Product;
    quantity: number;
}

export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export const getCart = async (): Promise<{ success: boolean; cart: Cart }> => {
    try {
        const response = await api.get('/cart');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to fetch cart',
            error: error.message
        };
    }
};

export const addToCart = async (productId: string, quantity = 1): Promise<{ success: boolean; message: string; cart: Cart }> => {
    try {
        const response = await api.post('/cart/add', { productId, quantity });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to add to cart',
            error: error.message
        };
    }
};

export const removeFromCart = async (productId: string): Promise<{ success: boolean; message: string; cart: Cart }> => {
    try {
        const response = await api.delete(`/cart/remove/${productId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to remove from cart',
            error: error.message
        };
    }
};

export const updateCartQuantity = async (productId: string, quantity: number): Promise<{ success: boolean; message: string; cart: Cart }> => {
    try {
        const response = await api.put('/cart/update', { productId, quantity });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to update cart',
            error: error.message
        };
    }
};
