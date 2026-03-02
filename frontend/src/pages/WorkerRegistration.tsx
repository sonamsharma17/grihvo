import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const WorkerRegistration = () => {
    const { t } = useTranslation();
    const { ref: sectionRef, isVisible } = useScrollAnimation(0.1);
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        type: searchParams.get('type') || 'Labour',
        category: '',
        name: '',
        phone: '',
        password: '',
        address: '',
        aadhar: '',
        age: ''
    });

    useEffect(() => {
        const typeParam = searchParams.get('type');
        if (typeParam === 'Labour' || typeParam === 'Professional') {
            setFormData(prev => ({ ...prev, type: typeParam }));
        }
    }, [searchParams]);
    const [status, setStatus] = useState<string | null>(null);

    const categories = [
        'Carpenter',
        'Painter',
        'Whitewasher',
        'Interior Designer',
        'POP Designer',
        'Tile/Flooring'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const response = await fetch('http://localhost:5000/api/workers/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setStatus('success');
                setFormData({
                    type: 'Labour',
                    category: '',
                    name: '',
                    phone: '',
                    password: '',
                    address: '',
                    aadhar: '',
                    age: ''
                });
            } else {
                setStatus('error');
                alert(data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setStatus('error');
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <section ref={sectionRef} className="py-20 px-4 relative min-h-screen flex items-center justify-center">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#4d3a2a]/40 via-[#5d4a3a]/50 to-transparent -z-10" />

            <div className={`max-w-2xl w-full bg-[#2d1a0a]/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-2xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-amber-100 mb-2">{t('worker_reg.heading')}</h2>
                    <p className="text-amber-100/70">{t('worker_reg.subheading')}</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-10">
                        <h3 className="text-2xl text-amber-100 font-bold mb-2">{t('worker_reg.success_heading')}</h3>
                        <p className="text-amber-100/70">{t('worker_reg.success_msg')}</p>
                        <button
                            onClick={() => setStatus(null)}
                            className="mt-6 px-6 py-2 bg-amber-500 text-[#1a120b] font-bold rounded-lg hover:bg-amber-400 transition-colors"
                        >
                            {t('worker_reg.register_another')}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Worker Type Selection */}
                        <div className="flex gap-4 mb-6">
                            <label className={`flex-1 cursor-pointer border rounded-lg p-4 text-center transition-all ${formData.type === 'Labour' ? 'bg-amber-500/20 border-amber-500 text-amber-100' : 'border-amber-500/20 text-amber-100/60 hover:border-amber-500/50'}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="Labour"
                                    checked={formData.type === 'Labour'}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <span className="font-semibold">{t('worker_reg.type_labour')}</span>
                            </label>
                            <label className={`flex-1 cursor-pointer border rounded-lg p-4 text-center transition-all ${formData.type === 'Professional' ? 'bg-amber-500/20 border-amber-500 text-amber-100' : 'border-amber-500/20 text-amber-100/60 hover:border-amber-500/50'}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="Professional"
                                    checked={formData.type === 'Professional'}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <span className="font-semibold">{t('worker_reg.type_professional')}</span>
                            </label>
                        </div>

                        {/* Professional Category (Conditional) */}
                        {formData.type === 'Professional' && (
                            <div>
                                <label className="block text-amber-100 mb-2 text-sm font-medium">{t('worker_reg.category_label')}</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#1a120b] border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500 transition-colors"
                                >
                                    <option value="" disabled>{t('worker_reg.category_placeholder')}</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Common Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-amber-100 mb-2 text-sm font-medium">{t('worker_reg.name_label')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder={t('worker_reg.name_placeholder')}
                                    className="w-full bg-[#1a120b] border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-amber-100 mb-2 text-sm font-medium">{t('worker_reg.phone_label')}</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder={t('worker_reg.phone_placeholder')}
                                    className="w-full bg-[#1a120b] border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-amber-100 mb-2 text-sm font-medium">{t('worker_reg.password_label')}</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder={t('worker_reg.password_placeholder')}
                                className="w-full bg-[#1a120b] border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-amber-100 mb-2 text-sm font-medium">{t('worker_reg.age_label')}</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    placeholder={t('worker_reg.age_placeholder')}
                                    className="w-full bg-[#1a120b] border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-amber-100 mb-2 text-sm font-medium">{t('worker_reg.aadhar_label')}</label>
                                <input
                                    type="text"
                                    name="aadhar"
                                    value={formData.aadhar}
                                    onChange={handleChange}
                                    required
                                    placeholder={t('worker_reg.aadhar_placeholder')}
                                    className="w-full bg-[#1a120b] border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-amber-100 mb-2 text-sm font-medium">{t('worker_reg.address_label')}</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                placeholder={t('worker_reg.address_placeholder')}
                                rows={3}
                                className="w-full bg-[#1a120b] border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-[#1a120b] font-bold py-4 rounded-lg hover:from-amber-400 hover:to-orange-500 transition-all shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'submitting' ? t('worker_reg.submitting') : t('worker_reg.submit_btn')}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default WorkerRegistration;
