
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, IndianRupee, Ruler, Phone, Search, Filter, Plus } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';

interface Property {
    _id: string;
    title: string;
    type: 'House' | 'Plot' | 'Flat' | 'Commercial';
    price: number;
    location: string;
    area: string;
    description: string;
    images: string[];
    sellerName: string;
    sellerPhone: string;
    createdAt: string;
}

const PropertyList = () => {
    const { ref: sectionRef, isVisible } = useScrollAnimation(0.1);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        fetchProperties();
    }, [filterType]);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            let url = 'http://localhost:5000/api/properties?';
            if (filterType) url += `type=${filterType}`;

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setProperties(data.properties);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
        return price.toLocaleString('en-IN');
    };

    const filteredProperties = properties.filter(prop =>
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section ref={sectionRef} className={`min-h-screen bg-[#1a120b] pt-28 pb-12 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-amber-100 mb-2">{t('property_list.heading')}</h1>
                        <p className="text-amber-100/60">{t('property_list.subheading')}</p>
                    </div>
                    <Link
                        to="/sell-property"
                        className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-[#1a120b] font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg hover:-translate-y-1 w-fit"
                    >
                        <Plus className="w-5 h-5" />
                        {t('property_list.sell_property')}
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-[#2d1a0a] rounded-xl border border-amber-500/10 p-6 mb-10 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/40" />
                            <input
                                type="text"
                                placeholder={t('property_list.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#1a120b] border border-amber-500/20 rounded-lg pl-10 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/50"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/40" />
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full bg-[#1a120b] border border-amber-500/20 rounded-lg pl-10 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/50 appearance-none"
                                >
                                    <option value="">{t('property_list.all_types')}</option>
                                    <option value="House">{t('property_list.type_house')}</option>
                                    <option value="Plot">{t('property_list.type_plot')}</option>
                                    <option value="Flat">{t('property_list.type_flat')}</option>
                                    <option value="Commercial">{t('property_list.type_commercial')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="text-center py-20 bg-[#2d1a0a]/40 rounded-xl border border-amber-500/10">
                        <Building2 className="w-16 h-16 text-amber-500/20 mx-auto mb-4" />
                        <p className="text-amber-100/40 text-lg">{t('property_list.no_properties')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProperties.map((property) => (
                            <div
                                key={property._id}
                                className="bg-[#2d1a0a]/60 backdrop-blur-sm border border-amber-500/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 group shadow-lg"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={property.images[0]?.startsWith('http')
                                            ? property.images[0]
                                            : `http://localhost:5000${property.images[0]}` || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
                                        alt={property.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-amber-500 text-[#1a120b] text-xs font-bold rounded-full uppercase tracking-wider">
                                            {t(`property_list.type_${property.type.toLowerCase()}`)}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
                                            <div className="flex items-center gap-1 text-amber-400 font-bold text-xl">
                                                <IndianRupee className="w-5 h-5" />
                                                <span>{formatPrice(property.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-amber-100 mb-2 truncate">{property.title}</h3>
                                    <div className="flex items-center gap-2 text-amber-100/60 text-sm mb-4">
                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{property.location}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-y border-amber-500/10 mb-6">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-amber-100/40 uppercase font-medium">{t('property_list.area_label')}</span>
                                            <div className="flex items-center gap-1 text-amber-100 font-bold">
                                                <Ruler className="w-4 h-4 text-amber-500" />
                                                <span>{property.area}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-amber-100/40 uppercase font-medium">{t('property_list.seller_label')}</span>
                                            <span className="text-amber-100 font-bold">{property.sellerName}</span>
                                        </div>
                                    </div>
                                    <a
                                        href={`tel:${property.sellerPhone}`}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-[#1a120b] border border-amber-500/30 text-amber-500 font-bold rounded-xl hover:bg-amber-500 hover:text-[#1a120b] transition-all"
                                    >
                                        <Phone className="w-4 h-4" />
                                        {t('property_list.contact_seller')}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PropertyList;
