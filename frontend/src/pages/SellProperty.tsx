
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Building2, MapPin, IndianRupee, Ruler, Phone, User, FileText, Camera } from 'lucide-react';

const SellProperty = () => {
    const { ref: sectionRef, isVisible } = useScrollAnimation(0.1);
    const navigate = useNavigate();
    const [status, setStatus] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'House',
        price: '',
        location: '',
        area: '',
        description: '',
        sellerName: '',
        sellerPhone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            const response = await fetch('https://grihvo-backend.onrender.com/api/properties/list', {
                method: 'POST',
                body: data
            });

            const result = await response.json();
            if (result.success) {
                setStatus('success');
                setTimeout(() => navigate('/properties-list'), 2000);
            } else {
                setStatus('error');
                alert(result.message || 'Failed to list property.');
            }
        } catch (error) {
            console.error('Error listing property:', error);
            setStatus('error');
        }
    };

    return (
        <section ref={sectionRef} className="min-h-screen bg-[#1a120b] pt-28 pb-12 px-4">
            <div className={`max-w-3xl mx-auto bg-[#2d1a0a]/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-2xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-amber-100 mb-3">List Your Property</h1>
                    <p className="text-amber-100/60">Sell or Rent your plot, house, or commercial space locally.</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-amber-100 mb-2">Property Listed Successfully!</h2>
                        <p className="text-amber-100/60">Redirecting to properties list...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-amber-100 mb-2 text-sm font-medium">Property Title</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/40" />
                                    <input
                                        type="text" name="title" required value={formData.title} onChange={handleChange}
                                        placeholder="e.g. Modern 3 BHK Villa"
                                        className="w-full bg-[#1a120b] border border-amber-500/20 rounded-lg pl-11 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-amber-100 mb-2 text-sm font-medium">Property Type</label>
                                <select
                                    name="type" value={formData.type} onChange={handleChange}
                                    className="w-full bg-[#1a120b] border border-amber-500/20 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/50"
                                >
                                    <option value="House">House</option>
                                    <option value="Plot">Plot</option>
                                    <option value="Flat">Flat</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-amber-100 mb-2 text-sm font-medium">Price (₹)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/40" />
                                    <input
                                        type="number" name="price" required value={formData.price} onChange={handleChange}
                                        placeholder="Enter total price"
                                        className="w-full bg-[#1a120b] border border-amber-500/20 rounded-lg pl-11 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-amber-100 mb-2 text-sm font-medium">Area (sqft/yard)</label>
                                <div className="relative">
                                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/40" />
                                    <input
                                        type="text" name="area" required value={formData.area} onChange={handleChange}
                                        placeholder="e.g. 1200 sqft"
                                        className="w-full bg-[#1a120b] border border-amber-500/20 rounded-lg pl-11 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-amber-100 mb-2 text-sm font-medium">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/40" />
                                <input
                                    type="text" name="location" required value={formData.location} onChange={handleChange}
                                    placeholder="Enter full address or locality"
                                    className="w-full bg-[#1a120b] border border-amber-500/20 rounded-lg pl-11 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-amber-100 mb-2 text-sm font-medium">Description</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-5 h-5 text-amber-500/40" />
                                <textarea
                                    name="description" required value={formData.description} onChange={handleChange}
                                    placeholder="Describe your property details..." rows={4}
                                    className="w-full bg-[#1a120b] border border-amber-500/20 rounded-lg pl-11 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/50 resize-none"
                                ></textarea>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div>
                                <label className="block text-amber-100 mb-2 text-sm font-medium">Seller Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/40" />
                                    <input
                                        type="text" name="sellerName" required value={formData.sellerName} onChange={handleChange}
                                        placeholder="Your full name"
                                        className="w-full bg-[#1a120b] border border-amber-500/20 rounded-lg pl-11 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-amber-100 mb-2 text-sm font-medium">Contact Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/40" />
                                    <input
                                        type="tel" name="sellerPhone" required value={formData.sellerPhone} onChange={handleChange}
                                        placeholder="Phone number"
                                        className="w-full bg-[#1a120b] border border-amber-500/20 rounded-lg pl-11 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-amber-100 mb-2 text-sm font-medium">Property Image</label>
                            <div className="relative">
                                <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/40" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full bg-[#1a120b] border border-amber-500/20 rounded-lg pl-11 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20"
                                />
                            </div>
                            {imageFile && (
                                <p className="mt-2 text-sm text-amber-500/70">Selected: {imageFile.name}</p>
                            )}
                        </div>

                        <button
                            type="submit" disabled={status === 'submitting'}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-[#1a120b] font-bold py-4 rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg hover:-translate-y-1 disabled:opacity-50"
                        >
                            {status === 'submitting' ? 'Listing Property...' : 'List Property Now'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default SellProperty;
