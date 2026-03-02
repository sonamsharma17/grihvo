import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateCartQuantity, CartItem } from '../api/cartService';
import { ShoppingCart, Trash2, ArrowLeft, Plus, Minus, Loader2, CreditCard } from 'lucide-react';
import { Product } from '../api/productService';
import { useTranslation } from 'react-i18next';

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const getImageUrl = (img: string) => {
        if (!img) return '';
        return img.startsWith('http') ? img : `http://localhost:5000/${img}`;
    };

    const fetchCart = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getCart();
            setCartItems(response.cart.items);
            calculateTotal(response.cart.items);
        } catch (err: any) {
            console.error('Failed to fetch cart', err);
            setError('Failed to load cart items');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const calculateTotal = (items: CartItem[]) => {
        const total = items.reduce((sum, item) => {
            if (item.productId && typeof item.productId === 'object') {
                return sum + ((item.productId as Product).sellingPrice * item.quantity);
            }
            return sum;
        }, 0);
        setTotalPrice(total);
    };

    const handleUpdateQuantity = async (productId: string | Product, newQuantity: number) => {
        if (newQuantity < 1) return;

        // Extract ID if it's populated object
        const id = typeof productId === 'object' ? productId._id : productId;

        try {
            // Optimistic update
            const updatedItems = cartItems.map(item => {
                const itemId = typeof item.productId === 'object' ? item.productId._id : item.productId;
                if (itemId === id) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
            setCartItems(updatedItems);
            calculateTotal(updatedItems);

            await updateCartQuantity(id, newQuantity);
            window.dispatchEvent(new CustomEvent('cart-update'));
        } catch (err: any) {
            console.error('Failed to update quantity', err);
            // Revert on failure
            fetchCart();
        }
    };

    const handleRemoveItem = async (productId: string | Product) => {
        const id = typeof productId === 'object' ? productId._id : productId;

        try {
            // Optimistic update
            const updatedItems = cartItems.filter(item => {
                const itemId = typeof item.productId === 'object' ? item.productId._id : item.productId;
                return itemId !== id;
            });
            setCartItems(updatedItems);
            calculateTotal(updatedItems);

            await removeFromCart(id);
            window.dispatchEvent(new CustomEvent('cart-update'));
        } catch (err: any) {
            console.error('Failed to remove item', err);
            fetchCart();
        }
    };

    const handleCheckout = () => {
        // Placeholder for checkout logic
        console.log('Proceeding to checkout with items:', cartItems);
        alert('Checkout functionality coming soon!');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1a120b] pt-28 pb-12 px-4 md:px-8 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a120b] pt-28 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header elements */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-[#2d1a0a] border border-amber-500/20 text-amber-500 rounded-full hover:bg-amber-500 hover:text-black transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-3xl md:text-4xl font-black text-amber-100 uppercase tracking-widest flex items-center gap-3">
                        <ShoppingCart className="w-8 h-8 text-amber-500" />
                        {t('cart.title')}
                    </h1>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6 font-bold">
                        {error}
                    </div>
                )}

                {cartItems.length === 0 ? (
                    <div className="bg-[#2d1a0a] border border-amber-500/20 rounded-2xl p-12 text-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <ShoppingCart className="w-20 h-20 text-amber-500/20 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-amber-100 mb-4">{t('cart.empty_cart')}</h2>
                        <p className="text-amber-100/40 mb-8 max-w-md mx-auto">
                            {t('cart.empty_cart_desc')}
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-amber-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                        >
                            {t('cart.explore_products')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => {
                                const product = item.productId as Product;
                                // Handle if product was deleted but still in cart
                                if (!product || !product.productName) {
                                    return (
                                        <div key={item._id} className="bg-[#2d1a0a] border border-red-500/20 rounded-2xl p-4 flex items-center justify-between">
                                            <p className="text-red-400">{t('cart.product_unavailable')}</p>
                                            <button
                                                onClick={() => handleRemoveItem('unknown')}
                                                className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    );
                                }

                                const mainImage = product.images?.[0];

                                return (
                                    <div key={item._id} className="bg-[#2d1a0a]/80 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl hover:border-amber-500/40 transition-all">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 bg-[#1a120b] rounded-xl flex items-center justify-center p-2 border border-amber-500/10 shrink-0 cursor-pointer overflow-hidden group">
                                            {mainImage ? (
                                                <img
                                                    src={getImageUrl(mainImage)}
                                                    alt={product.productName}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <ShoppingCart className="w-8 h-8 text-amber-500/20" />
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="inline-block px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded mb-2">
                                                {product.category || 'Product'}
                                            </div>
                                            <h3 className="text-lg font-bold text-amber-100 mb-1">{product.productName}</h3>
                                            <p className="text-amber-500 font-bold text-xl my-2">
                                                ₹{product.sellingPrice.toLocaleString('en-IN')}
                                                {product.unitType && <span className="text-xs text-amber-100/40 ml-1 font-normal">/ {product.unitType}</span>}
                                            </p>
                                        </div>

                                        {/* Quantity & Actions */}
                                        <div className="flex flex-col items-center gap-4 shrink-0 mt-4 md:mt-0">
                                            <div className="flex items-center gap-3 bg-[#1a120b] p-2 rounded-xl border border-amber-500/20">
                                                <button
                                                    onClick={() => handleUpdateQuantity(product, item.quantity - 1)}
                                                    className="p-1 text-amber-100/60 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-bold text-amber-100">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(product, item.quantity + 1)}
                                                    className="p-1 text-amber-100/60 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(product)}
                                                className="text-red-400/80 hover:text-red-500 flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" /> {t('cart.remove')}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#2d1a0a] border border-amber-500/30 rounded-2xl p-6 lg:p-8 sticky top-28 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                                <h3 className="text-xl font-black text-amber-100 uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-amber-500/10 pb-4">
                                    <CreditCard className="w-5 h-5 text-amber-500" />
                                    {t('cart.order_summary')}
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-amber-100/70">
                                        <span>{t('cart.subtotal')} ({cartItems.length} {t('cart.items')})</span>
                                        <span className="font-bold text-amber-100">₹{totalPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-amber-100/70">
                                        <span>{t('cart.delivery_fee')}</span>
                                        <span className="text-green-400 font-bold">{t('cart.free')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-amber-100/70">
                                        <span>{t('cart.taxes')}</span>
                                        <span>{t('cart.calculated_at_checkout')}</span>
                                    </div>
                                </div>

                                <div className="border-t border-amber-500/20 pt-4 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-amber-100">{t('cart.total_price')}</span>
                                        <span className="text-2xl font-black text-amber-500">₹{totalPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                    <p className="text-xs text-amber-100/40 text-right mt-1">{t('cart.inclusive_taxes')}</p>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-amber-500 text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02]"
                                >
                                    {t('cart.proceed_to_checkout')}
                                </button>

                                <div className="mt-4 text-center">
                                    <Link to="/products" className="text-xs font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest">
                                        {t('cart.continue_shopping')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
