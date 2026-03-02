import { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, Truck, ShoppingCart, Zap, CheckCircle2, ChevronRight, Award, Store, Loader2 } from 'lucide-react';
import { Product } from '../../api/productService';
import { addToCart } from '../../api/cartService';
import { isAuthenticated } from '../../api/authService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
}

const ProductDetailModal = ({ product, onClose }: ProductDetailModalProps) => {
    const [activeImage, setActiveImage] = useState((product.images && product.images[0]) || '');
    const [selectedSize, setSelectedSize] = useState('Default');
    const [isAdding, setIsAdding] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleAddToCart = async () => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        try {
            setIsAdding(true);
            setError(null);
            await addToCart(product._id, 1);
            setAddSuccess(true);
            window.dispatchEvent(new CustomEvent('cart-update'));
            setTimeout(() => setAddSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to add to cart');
        } finally {
            setIsAdding(false);
        }
    };

    // Safely extract business name from populated or raw businessId
    const businessInfo = typeof product.businessId === 'object' && product.businessId !== null
        ? product.businessId as { _id: string; businessName: string; city?: string }
        : null;

    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const getImageUrl = (img: string) => {
        return img.startsWith('http') ? img : `http://localhost:5000/${img}`;
    };

    return (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#1a120b]/95 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-[#2d1a0a] w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-500/20 shadow-2xl flex flex-col md:flex-row" style={{ animation: 'modalIn 0.3s ease-out' }}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-[#1a120b]/80 border border-amber-500/20 rounded-full text-amber-100 hover:bg-amber-500 hover:text-[#1a120b] transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Section: Image Gallery + Actions */}
                <div className="w-full md:w-3/5 p-6 flex flex-col gap-4">
                    {/* Image Row: Thumbnails + Main Image */}
                    <div className="flex flex-row gap-4">
                        {/* Vertical Thumbnails */}
                        <div className="flex flex-col gap-2">
                            {(product.images || []).map((img, idx) => (
                                <button
                                    key={idx}
                                    onMouseEnter={() => setActiveImage(img)}
                                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-amber-500 scale-105' : 'border-amber-500/10 hover:border-amber-500/30'
                                        }`}
                                >
                                    <img
                                        src={getImageUrl(img)}
                                        alt={`Product ${idx}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Main Large Image */}
                        <div className="flex-1 bg-[#1a120b] rounded-xl overflow-hidden border border-amber-500/10 group relative min-h-[380px] flex items-center justify-center">
                            {activeImage ? (
                                <img
                                    src={getImageUrl(activeImage)}
                                    alt={product.productName}
                                    className="w-full h-full object-contain p-4 transition-transform duration-700 hover:scale-110"
                                />
                            ) : (
                                <div className="text-amber-100/20 text-sm font-bold">{t('product_modal.no_image')}</div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Actions — below image */}
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`flex-1 h-14 border-2 font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${addSuccess
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'bg-[#2d1a0a] border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isAdding ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : addSuccess ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        {t('product_modal.added_to_cart')}
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5" />
                                        {t('product_modal.add_to_cart')}
                                    </>
                                )}
                            </button>
                            <button className="flex-1 h-14 bg-amber-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                <Zap className="w-5 h-5 fill-current" />
                                {t('product_modal.buy_now')}
                            </button>
                        </div>
                        {error && (
                            <p className="text-red-400 text-xs font-bold text-center">{error}</p>
                        )}
                    </div>

                    {/* Delivery Info — below buttons */}
                    <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <div className="p-2 bg-green-500 text-white rounded-full">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">{t('product_modal.free_delivery')}</p>
                            <p className="text-[11px] text-amber-100/40">{t('product_modal.delivery_estimate')}</p>
                        </div>
                    </div>
                </div>

                {/* Right Section: Details */}
                <div className="w-full md:w-2/5 p-6 md:p-8 space-y-6 bg-[#1a120b]/50">
                    {/* Brand & Title */}
                    <div>
                        <div className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">
                            {product.brand}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-amber-100 leading-tight">
                            {product.productName}
                        </h1>
                    </div>

                    {/* Price & Discount */}
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="text-3xl font-black text-amber-500">₹{(product.sellingPrice || 0).toLocaleString('en-IN')}</span>
                            {product.unitType && <span className="text-amber-100/40 text-sm">/ {product.unitType}</span>}
                            {product.actualPrice > product.sellingPrice && (
                                <span className="text-lg text-amber-100/40 line-through ml-2">₹{(product.actualPrice || 0).toLocaleString('en-IN')}</span>
                            )}
                            {product.discountPercentage > 0 && (
                                <span className="text-green-400 font-bold ml-auto">{product.discountPercentage}% OFF</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-400 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t('product_modal.inclusive_taxes')}</span>
                        </div>
                    </div>

                    {/* Ratings Block */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white rounded-full text-sm font-bold">
                            <span>4.3</span>
                            <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <div className="text-sm text-amber-100/40">
                            62,496 {t('product_modal.ratings')}, 37,973 {t('product_modal.reviews')}
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-3 bg-[#1a120b] border border-amber-500/10 rounded-xl group hover:border-amber-500/30 transition-all">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-amber-100 group-hover:text-amber-400 transition-colors uppercase tracking-tight">{t('product_modal.original_brand')}</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-[#1a120b] border border-amber-500/10 rounded-xl group hover:border-amber-500/30 transition-all">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 group-hover:bg-amber-500/20">
                                <Award className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-amber-100 group-hover:text-amber-400 transition-colors uppercase tracking-tight">{t('product_modal.verified_seller')}</span>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-4 pt-6 border-t border-amber-500/10">
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-6 bg-amber-500 rounded-full" />
                            <h3 className="text-lg font-bold text-amber-100 uppercase tracking-tight">{t('product_modal.about_product')}</h3>
                        </div>

                        <div className="space-y-4">
                            {product.description ? (
                                <p className="text-amber-100/90 text-sm font-semibold leading-relaxed">
                                    {product.description}
                                </p>
                            ) : (
                                <p className="text-amber-100/30 text-sm italic">{t('product_modal.no_description')}</p>
                            )}
                            {product.longDescription && (
                                <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                                    <p className="text-amber-100/70 text-sm leading-relaxed whitespace-pre-line">
                                        {product.longDescription}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Usage & Resistance Flags */}
                    {(product.isWaterResistant || product.isFireResistant || (product.usage && product.usage.length > 0)) && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {product.isWaterResistant && (
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20 uppercase">{t('product_modal.water_resistant')}</span>
                            )}
                            {product.isFireResistant && (
                                <span className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-full border border-red-500/20 uppercase">{t('product_modal.fire_resistant')}</span>
                            )}
                            {(product.usage || []).map(u => (
                                <span key={u} className="px-3 py-1 bg-amber-500/5 text-amber-100/40 text-[10px] font-bold rounded-full border border-amber-500/10 uppercase">{u}</span>
                            ))}
                        </div>
                    )}

                    {/* Selector Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-amber-500 uppercase tracking-widest">{t('product_modal.select_variant')}</label>
                        <div className="flex flex-wrap gap-2">
                            {['Standard', 'Premium', 'Export Quality'].map(variant => (
                                <button
                                    key={variant}
                                    onClick={() => setSelectedSize(variant)}
                                    className={`px-4 py-2 rounded-lg border-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedSize === variant
                                        ? 'border-amber-500 bg-amber-500 text-black'
                                        : 'border-amber-500/20 text-amber-100/40 hover:border-amber-500/50'
                                        }`}
                                >
                                    {variant}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Highlights */}
                    <div className="space-y-4 pt-6 border-t border-amber-500/10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-amber-100">{t('product_modal.product_highlights')}</h3>
                            <button className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                                {t('product_modal.more_info')} <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-y-4 text-[13px]">
                            <div className="space-y-1">
                                <p className="text-amber-100/40 font-bold uppercase text-[10px]">{t('product_modal.brand')}</p>
                                <p className="text-amber-100 font-medium">{product.brand}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-amber-100/40 font-bold uppercase text-[10px]">{t('product_modal.warranty')}</p>
                                <p className="text-amber-100 font-medium">{product.warranty || t('product_modal.no_warranty')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-amber-100/40 font-bold uppercase text-[10px]">{t('product_modal.certifications')}</p>
                                <p className="text-amber-100 font-medium">{(product.certifications || []).join(', ') || t('product_modal.standard_certified')}</p>
                            </div>
                            {Object.entries(product.specifications || {}).map(([key, value]) => (
                                <div key={key} className="space-y-1">
                                    <p className="text-amber-100/40 font-bold uppercase text-[10px]">{key}</p>
                                    <p className="text-amber-100 font-medium">{String(value)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sold By */}
                    {businessInfo && (
                        <div className="pt-5 border-t border-amber-500/10">
                            <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl hover:border-amber-500/30 transition-all group">
                                <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-500 group-hover:bg-amber-500/20 transition-colors">
                                    <Store className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest mb-0.5">{t('product_modal.sold_by')}</p>
                                    <p className="text-amber-100 font-bold text-sm">{businessInfo.businessName}</p>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
