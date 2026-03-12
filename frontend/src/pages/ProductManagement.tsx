import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { getMyProducts, deleteProduct, toggleProductStatus, Product } from '../api/productService';
import PriceDisplay from '../components/common/PriceDisplay';
import ProductModal from '../components/vendor/ProductModal';

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, [filterCategory]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const filters: any = {};
            if (filterCategory) filters.category = filterCategory;

            const response = await getMyProducts(1, 100, filters);
            if (response.success) {
                setProducts(response.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleProductStatus(id);
            fetchProducts();
        } catch (error) {
            console.error('Error toggling product status:', error);
            alert('Failed to toggle product status');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingProduct(null);
        fetchProducts();
    };

    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1a120b]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-amber-100/60">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a120b] pt-8 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-amber-100">Product Management</h1>
                            <p className="mt-2 text-amber-100/60">Manage your product catalog</p>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="inline-flex items-center px-6 py-3 bg-amber-500 text-[#1a120b] font-bold rounded-lg hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Product
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[#2d1a0a] rounded-lg shadow-lg border border-amber-500/10 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500/50" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[#1a120b] border border-amber-500/20 rounded-lg text-amber-100 placeholder-amber-500/30 focus:ring-2 focus:ring-amber-500/50 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-4 py-2 bg-[#1a120b] border border-amber-500/20 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500/50 focus:border-transparent outline-none"
                        >
                            <option value="">All Categories</option>
                            <option value="Tiles">Tiles</option>
                            <option value="Sanitary">Sanitary</option>
                            <option value="Lights">Lights</option>
                            <option value="Furniture">Furniture</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-[#2d1a0a] rounded-lg shadow-lg border border-amber-500/10 p-12 text-center">
                        <p className="text-amber-100/60 text-lg">No products found</p>
                        <button
                            onClick={handleAddNew}
                            className="mt-4 text-amber-500 hover:text-amber-400 font-medium"
                        >
                            Add your first product
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="bg-[#2d1a0a] rounded-lg shadow-lg border border-amber-500/10 overflow-hidden group hover:border-amber-500/30 transition-colors">
                                {/* Product Image */}
                                <div className="relative h-48 bg-[#1a120b] border-b border-amber-500/10">
                                    {product.images && product.images[0] ? (
                                        <>
                                            <img
                                                src={product.images[0].startsWith('http') ? product.images[0] : `https://grihvo-backend.onrender.com/${product.images[0]}`}
                                                alt={product.productName}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {product.images.length > 1 && (
                                                <div className="absolute bottom-2 left-2 bg-[#1a120b]/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-amber-500 border border-amber-500/20">
                                                    +{product.images.length - 1} MORE
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-amber-500/30">
                                            No Image
                                        </div>
                                    )}
                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${product.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${product.approvalStatus === 'approved' ? 'bg-blue-100 text-blue-800' :
                                            product.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {product.approvalStatus.charAt(0).toUpperCase() + product.approvalStatus.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-amber-100 mb-1 truncate group-hover:text-amber-400 transition-colors">
                                        {product.productName}
                                    </h3>
                                    <p className="text-sm text-amber-100/60 mb-3">{product.brand} • {product.category}</p>

                                    {/* Price */}
                                    <div className="mb-3">
                                        <PriceDisplay
                                            actualPrice={product.actualPrice}
                                            sellingPrice={product.sellingPrice}
                                            discountPercentage={product.discountPercentage}
                                            size="sm"
                                        />
                                    </div>

                                    {/* Stock */}
                                    <div className="mb-4">
                                        <p className="text-sm text-amber-100/60">
                                            Stock: <span className={`font-semibold ${product.stock < 10 ? 'text-red-400' : 'text-amber-100'
                                                }`}>{product.stock}</span>
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(product._id)}
                                            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors border ${product.isActive
                                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20'
                                                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20'
                                                }`}
                                        >
                                            {product.isActive ? (
                                                <><PowerOff className="h-4 w-4 mr-1" />Disable</>
                                            ) : (
                                                <><Power className="h-4 w-4 mr-1" />Enable</>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Modal */}
            {showModal && (
                <ProductModal
                    product={editingProduct}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default ProductManagement;
