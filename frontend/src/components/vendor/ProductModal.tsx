import { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { addProduct, updateProduct, Product, ProductFormData } from '../../api/productService';

interface ProductModalProps {
    product?: Product | null;
    onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
    const [productType, setProductType] = useState('Wood & Board');

    // Dynamic categories based on product type
    const getCategories = () => {
        switch (productType) {
            case 'Wood & Board':
                return ['Plywood', 'MDF', 'Particle Board', 'Laminates', 'Veneer', 'Timber'];
            case 'Electrical':
                return ['Wires & Cables', 'Switches & Sockets', 'MCB', 'Distribution Board', 'LED Lights', 'Conduits'];
            case 'Plumbing':
                return ['PVC Pipes', 'CPVC Pipes', 'Basins', 'Toilets', 'Showers', 'Water Tanks'];
            case 'Flooring':
                return ['Tiles', 'Marble', 'Granite', 'Wall Putty', 'POP', 'Wall Panels'];
            case 'Finishing':
                return ['Paint', 'Waterproofing', 'Adhesives', 'Putty', 'Polish'];
            case 'Hardware':
                return ['Locks', 'Hinges', 'Nails', 'Door Frames', 'Windows', 'Glass Panels'];
            default:
                return ['Tiles', 'Sanitary', 'Lights', 'Furniture', 'Other'];
        }
    };

    const [formData, setFormData] = useState<ProductFormData>({
        productName: '',
        category: '',
        brand: '',
        actualPrice: 0,
        sellingPrice: 0,
        stock: 0,
        minOrderQuantity: 1,
        description: '',
        longDescription: '',
        unitType: 'Piece',
        usage: [],
        certifications: [],
        isWaterResistant: false,
        isFireResistant: false,
        warranty: '',
        specifications: {},
        images: []
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [discountPercentage, setDiscountPercentage] = useState(0);

    // Initial state setup if editing
    useEffect(() => {
        if (product) {
            setFormData({
                productName: product.productName,
                category: product.category,
                brand: product.brand,
                actualPrice: product.actualPrice,
                sellingPrice: product.sellingPrice,
                stock: product.stock,
                minOrderQuantity: product.minOrderQuantity,
                description: product.description || '',
                longDescription: product.longDescription || '',
                unitType: product.unitType || 'Piece',
                usage: product.usage || [],
                certifications: product.certifications || [],
                isWaterResistant: product.isWaterResistant || false,
                isFireResistant: product.isFireResistant || false,
                warranty: product.warranty || '',
                specifications: product.specifications,
                images: []
            });
            setImagePreviews(product.images.map(img => img.startsWith('http') ? img : `http://localhost:5000/${img}`));
            calculateDiscount(product.actualPrice, product.sellingPrice);
        }
    }, [product]);

    const calculateDiscount = (actual: number, selling: number) => {
        if (actual > 0 && selling > 0) {
            const discount = Math.round(((actual - selling) / actual) * 100);
            setDiscountPercentage(discount);
        } else {
            setDiscountPercentage(0);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;

        let processedValue: any = value;

        if (type === 'number') {
            processedValue = value === '' ? 0 : parseFloat(value);
        } else if (type === 'checkbox') {
            processedValue = checked;
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));

        if (name === 'actualPrice' || name === 'sellingPrice') {
            const actual = name === 'actualPrice' ? (value === '' ? 0 : parseFloat(value)) : formData.actualPrice;
            const selling = name === 'sellingPrice' ? (value === '' ? 0 : parseFloat(value)) : formData.sellingPrice;
            calculateDiscount(actual, selling);
        }
    };

    const handleTypeChange = (newType: string) => {
        setProductType(newType);
        setFormData(prev => ({
            ...prev,
            category: '',
            specifications: {}
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + imagePreviews.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...files] }));

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.sellingPrice > formData.actualPrice) {
            alert('Selling price cannot be greater than actual price');
            return;
        }

        try {
            setLoading(true);
            if (product) {
                await updateProduct(product._id, formData);
            } else {
                await addProduct(formData);
            }
            onClose();
        } catch (error: any) {
            console.error('Error saving product:', error);
            alert(error.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a120b] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20 shadow-2xl">
                <div className="sticky top-0 bg-[#1a120b] border-b border-amber-500/20 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-amber-100">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="text-amber-100/60 hover:text-amber-100 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Basic Info */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-semibold text-amber-500 border-b border-amber-500/10 pb-2">1. Basic Information</h3>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-amber-100/60">Product Type</label>
                            <div className="flex flex-wrap gap-2">
                                {['Wood & Board', 'Electrical', 'Plumbing', 'Flooring', 'Finishing', 'Hardware'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleTypeChange(type)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${productType === type
                                            ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                            : 'bg-[#2d1a0a] text-amber-100/40 border-amber-500/10 hover:border-amber-500/30'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-amber-500 uppercase mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none focus:border-amber-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-amber-500 uppercase mb-1">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none"
                                >
                                    <option value="">Select Category</option>
                                    {getCategories().map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-amber-500 uppercase mb-1">Brand Name *</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-amber-500 uppercase mb-1">Short Description *</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Brief highlight of the product"
                                    className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-amber-500 uppercase mb-1">Full Description</label>
                                <textarea
                                    name="longDescription"
                                    value={formData.longDescription}
                                    onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                                    rows={4}
                                    placeholder="Detailed information about the usage, quality, and material"
                                    className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Pricing & Stock */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-semibold text-amber-500 border-b border-amber-500/10 pb-2">2. Pricing & Inventory</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-amber-500 uppercase mb-1">MRP Price *</label>
                                <input
                                    type="number"
                                    name="actualPrice"
                                    value={formData.actualPrice}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-amber-500 uppercase mb-1">Selling Price *</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="sellingPrice"
                                        value={formData.sellingPrice}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none"
                                    />
                                    {discountPercentage > 0 && (
                                        <span className="absolute right-2 top-2 px-2 py-0.5 bg-green-500 text-black text-[10px] font-bold rounded">
                                            {discountPercentage}% OFF
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-amber-500 uppercase mb-1">Unit Type *</label>
                                <select
                                    name="unitType"
                                    value={formData.unitType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none"
                                >
                                    {['Piece', 'Box', 'Kg', 'Meter', 'Sq Ft', 'Coil', 'Roll', 'Litre'].map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-amber-500 uppercase mb-1">Available Stock *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-amber-500 uppercase mb-1">Min Order Qty</label>
                                <input
                                    type="number"
                                    name="minOrderQuantity"
                                    value={formData.minOrderQuantity}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Properties & Legal */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-semibold text-amber-500 border-b border-amber-500/10 pb-2">3. Material Properties & Quality</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-amber-500 uppercase">Resistance Features</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="isWaterResistant"
                                            checked={formData.isWaterResistant}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 rounded border-amber-500/20 bg-[#2d1a0a] text-amber-500 cursor-pointer"
                                        />
                                        <span className="text-sm text-amber-100/60 group-hover:text-amber-100 transition-colors">Water Resistant</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="isFireResistant"
                                            checked={formData.isFireResistant}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 rounded border-amber-500/20 bg-[#2d1a0a] text-amber-500 cursor-pointer"
                                        />
                                        <span className="text-sm text-amber-100/60 group-hover:text-amber-100 transition-colors">Fire Resistant</span>
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-amber-500 uppercase">Usage Scenarios (Comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="Flooring, Wall, Bathroom"
                                    value={formData.usage?.join(', ')}
                                    onChange={(e) => setFormData(prev => ({ ...prev, usage: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
                                    className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-amber-500 uppercase mb-1">Warranty Period</label>
                                <input
                                    type="text"
                                    name="warranty"
                                    value={formData.warranty}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 5 Years"
                                    className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-amber-500 uppercase mb-1">Certifications (Comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="ISI, ISO 9001, BIS"
                                    value={formData.certifications?.join(', ')}
                                    onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
                                    className="w-full px-4 py-2 bg-[#2d1a0a] border border-amber-500/20 rounded-lg text-amber-100 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Image Upload */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-semibold text-amber-500 border-b border-amber-500/10 pb-2">4. Product Visuals</h3>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-amber-500/20 bg-amber-500/5 rounded-xl p-8 text-center hover:border-amber-500/40 transition-all">
                                <Upload className="w-12 h-12 text-amber-500/20 mx-auto mb-3" />
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="modal-image-upload"
                                />
                                <label htmlFor="modal-image-upload" className="cursor-pointer px-6 py-2 bg-amber-500/10 text-amber-500 font-bold rounded-lg hover:bg-amber-500/20 transition-all inline-block">
                                    Browse High-Res Images
                                </label>
                                <p className="text-xs text-amber-100/30 mt-3">Up to 5 images. Ideal size 800x800px.</p>
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {imagePreviews.map((preview, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-amber-500/20 group">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex gap-4 pt-6 border-t border-amber-500/20">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-amber-500/20 text-amber-500 font-bold rounded-xl hover:bg-amber-500/10 transition-all"
                        >
                            Discard Changes
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-amber-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                        >
                            {loading ? 'Processing...' : (product ? 'Sync Updates' : 'Publish Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
