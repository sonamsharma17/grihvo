import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getAllProducts, Product } from '../api/productService';
import PriceDisplay from '../components/common/PriceDisplay';
import { useSearchParams } from 'react-router-dom';
import ProductDetailModal from '../components/public/ProductDetailModal';
import { useTranslation } from 'react-i18next';

const PublicProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category') || '';
    const [filterCategory, setFilterCategory] = useState(categoryParam);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { t } = useTranslation();

    // Sync searchTerm with URL search parameter
    useEffect(() => {
        const search = searchParams.get('search');
        if (search) setSearchTerm(search);
    }, [searchParams]);

    useEffect(() => {
        setFilterCategory(categoryParam);
    }, [categoryParam]);

    // Auto-open modal if productId is in URL
    useEffect(() => {
        const productId = searchParams.get('productId');
        if (productId && products.length > 0) {
            const product = products.find(p => p._id === productId);
            if (product) setSelectedProduct(product);
        }
    }, [searchParams, products]);

    useEffect(() => {
        fetchProducts();
    }, [filterCategory]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const filters: any = {};
            if (filterCategory) filters.category = filterCategory;

            const response = await getAllProducts(1, 100, filters);
            if (response.success) {
                setProducts(response.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        setFilterCategory(newCategory);
        setSearchParams(newCategory ? { category: newCategory } : {});
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
                    <p className="mt-4 text-amber-100/60">{t('public_products.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a120b] pt-28 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-amber-100 mb-2">{t('public_products.heading')}</h1>
                    <p className="text-amber-100/60">{t('public_products.subheading')}</p>
                </div>

                {/* Filters */}
                <div className="bg-[#2d1a0a] rounded-lg shadow-lg border border-amber-500/10 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500/50" />
                            <input
                                type="text"
                                placeholder={t('public_products.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[#1a120b] border border-amber-500/20 rounded-lg text-amber-100 placeholder-amber-500/30 focus:ring-2 focus:ring-amber-500/50 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={filterCategory}
                            onChange={handleCategoryChange}
                            className="w-full px-4 py-2 bg-[#1a120b] border border-amber-500/20 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500/50 focus:border-transparent outline-none"
                        >
                            <option value="">{t('public_products.all_categories')}</option>
                            <option value="Tiles">{t('public_products.tiles')}</option>
                            <option value="Sanitary">{t('public_products.sanitary')}</option>
                            <option value="Lights">{t('public_products.lights')}</option>
                            <option value="Furniture">{t('public_products.furniture')}</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-[#2d1a0a] rounded-lg shadow-lg border border-amber-500/10 p-12 text-center">
                        <p className="text-amber-100/60 text-lg">{t('public_products.no_products')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="bg-[#2d1a0a] rounded-lg shadow-lg border border-amber-500/10 overflow-hidden group hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
                                {/* Product Image */}
                                <div className="relative h-48 bg-[#1a120b] border-b border-amber-500/10 overflow-hidden">
                                    {product.images && product.images[0] ? (
                                        <img
                                            src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000/${product.images[0]}`}
                                            alt={product.productName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-amber-500/30">
                                            {t('public_products.no_image')}
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="p-4">
                                    <div className="mb-2">
                                        <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                                            {product.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-amber-100 mb-1 truncate group-hover:text-amber-400 transition-colors">
                                        {product.productName}
                                    </h3>
                                    <p className="text-sm text-amber-100/60 mb-3">{product.brand}</p>

                                    {/* Price */}
                                    <div className="mb-3">
                                        <PriceDisplay
                                            actualPrice={product.actualPrice}
                                            sellingPrice={product.sellingPrice}
                                            discountPercentage={product.discountPercentage}
                                            size="sm"
                                        />
                                    </div>

                                    {/* View Details Button */}
                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        className="w-full py-2 bg-amber-500 text-[#1a120b] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                                    >
                                        {t('public_products.view_details')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default PublicProducts;
