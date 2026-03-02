import api from './axiosConfig';

// TypeScript Interfaces
export interface ProductSpecifications {
    [key: string]: any; // Allow flexible fields

    // Tiles
    size?: string;
    length?: number;
    width?: number;
    thickness?: number;
    material?: string;
    color?: string;
    finish?: string;
    piecesPerBox?: number;
    coveragePerBox?: number;
    installationService?: boolean;

    // Sanitary
    type?: string;
    waterType?: string;

    // Lights
    watt?: number;
    colorTemperature?: string;
    voltage?: number;

    // Furniture
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
}

export interface Product {
    _id: string;
    productName: string;
    images: string[];
    category: string;
    brand: string;
    actualPrice: number;
    sellingPrice: number;
    discountPercentage: number;
    stock: number;
    minOrderQuantity: number;
    description: string;
    longDescription?: string;
    unitType: 'Piece' | 'Box' | 'Kg' | 'Meter' | 'Sq Ft' | 'Coil' | 'Roll' | 'Litre';
    usage: string[];
    isWaterResistant: boolean;
    isFireResistant: boolean;
    durabilityYears?: number;
    certifications: string[];
    warranty?: string;
    manufacturingDate?: string;
    specifications: ProductSpecifications;
    businessId: string | { _id: string; businessName: string; city?: string };
    isActive: boolean;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export interface ProductFormData {
    productName: string;
    category: string;
    brand: string;
    actualPrice: number;
    sellingPrice: number;
    stock: number;
    description: string;
    longDescription?: string;
    unitType: string;
    usage?: string[];
    isWaterResistant?: boolean;
    isFireResistant?: boolean;
    certifications?: string[];
    warranty?: string;
    minOrderQuantity: number;
    specifications: ProductSpecifications;
    images?: File[];
}

// Add Product
export const addProduct = async (productData: ProductFormData): Promise<{ success: boolean; message: string; product?: Product }> => {
    try {
        const formData = new FormData();

        // Append common fields
        formData.append('productName', productData.productName);
        formData.append('category', productData.category);
        formData.append('brand', productData.brand);
        formData.append('actualPrice', productData.actualPrice.toString());
        formData.append('sellingPrice', productData.sellingPrice.toString());
        formData.append('stock', productData.stock.toString());
        formData.append('minOrderQuantity', productData.minOrderQuantity.toString());
        formData.append('description', productData.description);
        if (productData.longDescription) formData.append('longDescription', productData.longDescription);
        formData.append('unitType', productData.unitType);

        if (productData.usage) {
            formData.append('usage', JSON.stringify(productData.usage));
        }
        if (productData.certifications) {
            formData.append('certifications', JSON.stringify(productData.certifications));
        }

        formData.append('isWaterResistant', String(productData.isWaterResistant || false));
        formData.append('isFireResistant', String(productData.isFireResistant || false));
        if (productData.warranty) formData.append('warranty', productData.warranty);

        // Append specifications as JSON string
        formData.append('specifications', JSON.stringify(productData.specifications));

        // Append images
        if (productData.images && productData.images.length > 0) {
            productData.images.forEach((image) => {
                formData.append('images', image);
            });
        }

        const response = await api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to add product',
            error: error.message
        };
    }
};

// Get All Public Products
export const getAllProducts = async (page = 1, limit = 20, filters?: { category?: string }): Promise<{ success: boolean; products: Product[]; pagination: any }> => {
    try {
        const params: any = { page, limit };
        if (filters?.category) params.category = filters.category;

        const response = await api.get('/products', { params });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        };
    }
};

// Get Vendor's Products
export const getMyProducts = async (page = 1, limit = 20, filters?: { category?: string; isActive?: boolean }): Promise<{ success: boolean; products: Product[]; pagination: any }> => {
    try {
        const params: any = { page, limit };
        if (filters?.category) params.category = filters.category;
        if (filters?.isActive !== undefined) params.isActive = filters.isActive;

        const response = await api.get('/products/my-products', { params });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        };
    }
};

// Update Product
export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<{ success: boolean; message: string; product?: Product }> => {
    try {
        const formData = new FormData();

        // Append fields if they exist
        if (productData.productName) formData.append('productName', productData.productName);
        if (productData.category) formData.append('category', productData.category);
        if (productData.brand) formData.append('brand', productData.brand);
        if (productData.actualPrice) formData.append('actualPrice', productData.actualPrice.toString());
        if (productData.sellingPrice) formData.append('sellingPrice', productData.sellingPrice.toString());
        if (productData.stock !== undefined) formData.append('stock', productData.stock.toString());
        if (productData.minOrderQuantity) formData.append('minOrderQuantity', productData.minOrderQuantity.toString());
        if (productData.description) formData.append('description', productData.description);
        if (productData.longDescription) formData.append('longDescription', productData.longDescription);
        if (productData.unitType) formData.append('unitType', productData.unitType);

        if (productData.usage) formData.append('usage', JSON.stringify(productData.usage));
        if (productData.certifications) formData.append('certifications', JSON.stringify(productData.certifications));

        if (productData.isWaterResistant !== undefined) formData.append('isWaterResistant', String(productData.isWaterResistant));
        if (productData.isFireResistant !== undefined) formData.append('isFireResistant', String(productData.isFireResistant));
        if (productData.warranty) formData.append('warranty', productData.warranty);

        if (productData.specifications) {
            formData.append('specifications', JSON.stringify(productData.specifications));
        }

        if (productData.images && productData.images.length > 0) {
            productData.images.forEach((image) => {
                formData.append('images', image);
            });
        }

        const response = await api.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to update product',
            error: error.message
        };
    }
};

// Delete Product
export const deleteProduct = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to delete product',
            error: error.message
        };
    }
};

// Toggle Product Status
export const toggleProductStatus = async (id: string): Promise<{ success: boolean; message: string; product?: Product }> => {
    try {
        const response = await api.patch(`/products/${id}/toggle`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to toggle product status',
            error: error.message
        };
    }
};
