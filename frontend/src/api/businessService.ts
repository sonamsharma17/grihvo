import api from './axiosConfig';

export interface BusinessRegistrationData {
    // Step 1: Basic Details
    businessName: string;
    ownerName: string;
    mobile: string;
    email: string;
    businessCategory: string;
    password: string;

    // Step 2: Location
    address: string;
    city: string;
    pincode: string;
    coordinates: { lat: number; lng: number };
    serviceRadius: number;
    landmark: string;

    // Step 3: Capacity
    serviceType: string;
    dailyCapacity: string;
    minOrderValue: string;
    deliveryAvailable: boolean;
    deliveryCharge: string;

    // Step 4: Products
    categories: string[];
    brands: Record<string, any>;
    priceRanges: Record<string, any>;
    stockLevels: Record<string, any>;

    // Step 5: Legal
    gstNumber: string;
    shopLicense: string;
    panCard: string;
    idProof: File | null;

    // Step 6: Working Hours
    workingDays: string[];
    openTime: string;
    closeTime: string;
    emergencyOrders: boolean;

    // Step 7: Payment
    accountNumber: string;
    ifsc: string;
    accountHolder: string;
    payoutCycle: string;
}

export interface BusinessRegistrationResponse {
    success: boolean;
    message: string;
    businessId?: string;
    status?: string;
    error?: string;
}

// Register a new business
export const registerBusiness = async (data: BusinessRegistrationData): Promise<BusinessRegistrationResponse> => {
    try {
        // Create FormData for file upload
        const formData = new FormData();

        // Append all text fields
        formData.append('businessName', data.businessName);
        formData.append('ownerName', data.ownerName);
        formData.append('mobile', data.mobile);
        formData.append('email', data.email);
        formData.append('businessCategory', data.businessCategory);
        formData.append('password', data.password); // Add password field

        formData.append('address', data.address);
        formData.append('city', data.city);
        formData.append('pincode', data.pincode);
        formData.append('coordinates', JSON.stringify(data.coordinates));
        formData.append('serviceRadius', data.serviceRadius.toString());
        formData.append('landmark', data.landmark);

        formData.append('serviceType', data.serviceType);
        formData.append('dailyCapacity', data.dailyCapacity);
        formData.append('minOrderValue', data.minOrderValue);
        formData.append('deliveryAvailable', data.deliveryAvailable.toString());
        formData.append('deliveryCharge', data.deliveryCharge);

        formData.append('categories', JSON.stringify(data.categories));
        formData.append('brands', JSON.stringify(data.brands));
        formData.append('priceRanges', JSON.stringify(data.priceRanges));
        formData.append('stockLevels', JSON.stringify(data.stockLevels));

        formData.append('gstNumber', data.gstNumber);
        formData.append('shopLicense', data.shopLicense);
        formData.append('panCard', data.panCard);
        if (data.idProof) {
            formData.append('idProof', data.idProof);
        }

        formData.append('workingDays', JSON.stringify(data.workingDays));
        formData.append('openTime', data.openTime);
        formData.append('closeTime', data.closeTime);
        formData.append('emergencyOrders', data.emergencyOrders.toString());

        formData.append('accountNumber', data.accountNumber);
        formData.append('ifsc', data.ifsc);
        formData.append('accountHolder', data.accountHolder);
        formData.append('payoutCycle', data.payoutCycle);

        // Send request
        const response = await api.post<BusinessRegistrationResponse>('/business/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to register business',
            error: error.message
        };
    }
};

// Get all businesses (for admin)
export const getAllBusinesses = async (): Promise<{ success: boolean; businesses: any[]; count: number }> => {
    try {
        const response = await api.get('/business');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to fetch businesses',
            error: error.message
        };
    }
};

// Update business status (approve/reject)
export const updateBusinessStatus = async (
    businessId: string,
    status: 'approved' | 'rejected' | 'pending',
    rejectionReason?: string
): Promise<{ success: boolean; message: string; business: any }> => {
    try {
        const response = await api.patch(`/business/${businessId}/status`, {
            status,
            rejectionReason
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to update business status',
            error: error.message
        };
    }
};
