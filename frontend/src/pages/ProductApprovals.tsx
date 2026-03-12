import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { getPendingProducts, updateProductStatus } from '../api/superAdminService';
import PriceDisplay from '../components/common/PriceDisplay';

interface PendingProduct {
    _id: string;
    productName: string;
    images: string[];
    category: string;
    brand: string;
    actualPrice: number;
    sellingPrice: number;
    discountPercentage: number;
    stock: number;
    approvalStatus: string;
    businessId: {
        _id: string;
        businessName: string;
        ownerName: string;
        email?: string;
        phone?: string;
    };
    createdAt: string;
}

const ProductApprovals = () => {
    const [products, setProducts] = useState<PendingProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const fetchPendingProducts = async () => {
        try {
            setLoading(true);
            const response = await getPendingProducts();
            if (response.success) {
                setProducts(response.products);
            }
        } catch (error) {
            console.error('Error fetching pending products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        if (!window.confirm(`Are you sure you want to ${status} this product?`)) return;

        try {
            setActionLoading(id);
            await updateProductStatus(id, status);
            // Remove from list
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (error) {
            console.error(`Error ${status} product:`, error);
            alert(`Failed to ${status} product`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1a120b]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-amber-100/60">Loading pending approvals...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a120b] pt-8 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-amber-100">Product Approvals</h1>
                    <p className="mt-2 text-amber-100/60">Review and approve vendor products</p>
                </div>

                {/* Products List */}
                {products.length === 0 ? (
                    <div className="bg-[#2d1a0a] rounded-lg shadow-lg border border-amber-500/10 p-12 text-center">
                        <p className="text-amber-100/60 text-lg">No pending products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="bg-[#2d1a0a] rounded-lg shadow-lg border border-amber-500/10 overflow-hidden flex flex-col md:flex-row">
                                {/* Images Gallery */}
                                <div className="md:w-72 bg-[#1a120b] shrink-0 p-2 flex flex-col gap-2">
                                    {product.images && product.images.length > 0 ? (
                                        <>
                                            <div className="h-48 rounded-lg overflow-hidden border border-amber-500/10">
                                                <img
                                                    src={product.images[0].startsWith('http') ? product.images[0] : `https://grihvo-backend.onrender.com/${product.images[0]}`}
                                                    alt={product.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {product.images.length > 1 && (
                                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                                    {product.images.slice(1).map((img, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={img.startsWith('http') ? img : `https://grihvo-backend.onrender.com/${img}`}
                                                            alt={`${product.productName} ${idx + 2}`}
                                                            className="h-16 w-16 object-cover rounded border border-amber-500/10 hover:border-amber-500/30 transition-colors cursor-pointer"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-[10px] text-amber-500/50 text-center uppercase tracking-widest">
                                                {product.images.length} Images Uploaded
                                            </p>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-amber-500/30 min-h-[200px]">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-semibold text-amber-100 mb-1">
                                                    {product.productName}
                                                </h3>
                                                <p className="text-sm text-amber-100/60 mb-2">
                                                    by <span className="text-amber-500">{product.businessId.businessName}</span> ({product.businessId.ownerName})
                                                </p>
                                                <div className="flex gap-2 mb-3">
                                                    <span className="px-2 py-1 text-xs font-semibold bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                                                        {product.category}
                                                    </span>
                                                    <span className="px-2 py-1 text-xs font-semibold bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                                                        {product.brand}
                                                    </span>
                                                </div>
                                            </div>
                                            <PriceDisplay
                                                actualPrice={product.actualPrice}
                                                sellingPrice={product.sellingPrice}
                                                discountPercentage={product.discountPercentage}
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-amber-500/10">
                                        <button
                                            onClick={() => handleAction(product._id, 'approved')}
                                            disabled={actionLoading === product._id}
                                            className="flex items-center px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors border border-green-500/20 disabled:opacity-50"
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(product._id, 'rejected')}
                                            disabled={actionLoading === product._id}
                                            className="flex items-center px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20 disabled:opacity-50"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Reject
                                        </button>
                                        {/* Future: View Details Modal */}
                                        {/* <button className="ml-auto text-amber-500 hover:text-amber-400">
                                            View Details
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductApprovals;
