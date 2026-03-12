
import { useEffect, useState } from 'react';
import { Search, User, Phone, MapPin, Briefcase, Eye } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useSearchParams } from 'react-router-dom';
import WorkerDetailModal from '../components/public/WorkerDetailModal';
import { useTranslation } from 'react-i18next';

interface Worker {
    _id: string;
    type: 'Labour' | 'Professional';
    category?: string;
    name: string;
    phone: string;
    address: string;
    aadhar: string;
    age: number;
}

const WorkerList = () => {
    const { ref: sectionRef, isVisible } = useScrollAnimation(0.1);
    const [searchParams] = useSearchParams();
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
    const [filterType, setFilterType] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterLocation, setFilterLocation] = useState(searchParams.get('location') || '');
    const [availableLocations, setAvailableLocations] = useState<string[]>([]);
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
    const { t } = useTranslation();

    // Sync searchTerm with URL query parameter
    useEffect(() => {
        const query = searchParams.get('query');
        if (query) setSearchTerm(query);
    }, [searchParams]);

    const categories = [
        'Carpenter',
        'Painter',
        'Whitewasher',
        'Interior Designer',
        'POP Designer',
        'Tile/Flooring'
    ];

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('https://grihvo-backend.onrender.com/api/workers/locations');
                const data = await response.json();
                if (data.success) {
                    setAvailableLocations(data.locations);
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();
    }, []);

    useEffect(() => {
        fetchWorkers();
    }, [filterType, filterCategory, filterLocation]);

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            let url = 'https://grihvo-backend.onrender.com/api/workers?';
            if (filterType) url += `type=${filterType}&`;
            if (filterCategory) url += `category=${filterCategory}&`;
            if (filterLocation) url += `address=${encodeURIComponent(filterLocation)}&`;

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setWorkers(data.workers);
            }
        } catch (error) {
            console.error('Error fetching workers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredWorkers = workers.filter(worker =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (worker.category && worker.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <section ref={sectionRef} className={`min-h-screen bg-[#1a120b] pt-28 pb-12 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-amber-100 mb-2">{t('worker_list.heading')}</h1>
                    <p className="text-amber-100/60">{t('worker_list.subheading')}</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-[#2d1a0a] rounded-xl border border-amber-500/10 p-6 mb-8 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/40" />
                            <input
                                type="text"
                                placeholder={t('worker_list.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#1a120b] border border-amber-500/20 rounded-lg pl-10 pr-4 py-2.5 text-amber-100 focus:outline-none focus:border-amber-500/50 transition-colors"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => {
                                setFilterType(e.target.value);
                                if (e.target.value !== 'Professional') setFilterCategory('');
                            }}
                            className="bg-[#1a120b] border border-amber-500/20 rounded-lg px-4 py-2.5 text-amber-100 focus:outline-none focus:border-amber-500/50"
                        >
                            <option value="">{t('worker_list.all_types')}</option>
                            <option value="Labour">{t('worker_list.type_labour')}</option>
                            <option value="Professional">{t('worker_list.type_professional')}</option>
                        </select>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            disabled={filterType !== 'Professional'}
                            className="bg-[#1a120b] border border-amber-500/20 rounded-lg px-4 py-2.5 text-amber-100 focus:outline-none focus:border-amber-500/50 disabled:opacity-50"
                        >
                            <option value="">{t('worker_list.all_categories')}</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            value={filterLocation}
                            onChange={(e) => setFilterLocation(e.target.value)}
                            className="bg-[#1a120b] border border-amber-500/20 rounded-lg px-4 py-2.5 text-amber-100 focus:outline-none focus:border-amber-500/50"
                        >
                            <option value="">{t('worker_list.all_locations')}</option>
                            {availableLocations.map((loc, idx) => (
                                <option key={idx} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredWorkers.length === 0 ? (
                    <div className="text-center py-20 bg-[#2d1a0a]/40 rounded-xl border border-amber-500/10">
                        <p className="text-amber-100/40 text-lg">{t('worker_list.no_workers')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredWorkers.map((worker) => (
                            <div
                                key={worker._id}
                                className="bg-[#2d1a0a]/60 backdrop-blur-sm border border-amber-500/10 rounded-xl p-6 hover:border-amber-500/30 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                        <User className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${worker.type === 'Professional' ? 'bg-amber-500/20 text-amber-100' : 'bg-green-500/20 text-green-100'}`}>
                                        {t(`worker_list.type_${worker.type.toLowerCase()}`)}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-amber-100 mb-1">{worker.name}</h3>
                                {worker.category && (
                                    <div className="flex items-center gap-2 text-amber-500/80 mb-3">
                                        <Briefcase className="w-4 h-4" />
                                        <span className="text-sm font-semibold uppercase">{worker.category}</span>
                                    </div>
                                )}
                                <div className="space-y-2 mb-6 text-amber-100/60 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <span>+91 {worker.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                        <span className="line-clamp-2">{worker.address}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setSelectedWorker(worker)}
                                        className="w-full py-2.5 bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-500 border border-amber-500/20 font-bold rounded-lg hover:bg-amber-500 hover:text-[#1a120b] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        {t('worker_list.view_details')}
                                    </button>
                                    <a
                                        href={`tel:${worker.phone}`}
                                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-[#1a120b] font-bold rounded-lg hover:from-amber-400 hover:to-orange-500 transition-all shadow-md group-hover:shadow-amber-500/20 flex items-center justify-center gap-2"
                                    >
                                        <Phone className="w-4 h-4" />
                                        {t('worker_list.contact_now')}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Worker Detail Modal */}
            {selectedWorker && (
                <WorkerDetailModal
                    worker={selectedWorker}
                    onClose={() => setSelectedWorker(null)}
                />
            )}
        </section>
    );
};

export default WorkerList;
