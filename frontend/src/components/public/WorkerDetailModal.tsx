import { X, User, Phone, MapPin, Briefcase, ShieldCheck, Mail, Calendar, Award, Star } from 'lucide-react';

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

interface WorkerDetailModalProps {
    worker: Worker;
    onClose: () => void;
}

const WorkerDetailModal = ({ worker, onClose }: WorkerDetailModalProps) => {
    // Handle ESC key to close
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-[#1a120b]/90 backdrop-blur-md"
            onClick={handleBackdropClick}
        >
            <div
                className="relative w-full max-w-4xl bg-[#2d1a0a] border border-amber-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden"
                style={{ animation: 'modalIn 0.3s ease-out' }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-[#1a120b]/80 hover:bg-amber-500 rounded-full text-amber-500 hover:text-[#1a120b] transition-all duration-300"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Panel - Profile & Major Actions */}
                <div className="w-full md:w-2/5 p-8 bg-[#1a120b]/50 border-r border-amber-500/10 flex flex-col">
                    <div className="flex-1 flex flex-col items-center">
                        {/* Profile Image/Icon Placeholder */}
                        <div className="relative mb-6">
                            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-2 border-amber-500/30 flex items-center justify-center overflow-hidden">
                                <User className="w-24 h-24 text-amber-500/40" />
                            </div>
                            <div className="absolute -bottom-3 -right-3 p-3 bg-green-500 rounded-xl border-4 border-[#2d1a0a] text-white shadow-lg">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="text-center space-y-2 mb-8">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${worker.type === 'Professional' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
                                }`}>
                                {worker.type}
                            </span>
                            <h2 className="text-3xl font-black text-amber-100">{worker.name}</h2>
                            {worker.category && (
                                <div className="flex items-center justify-center gap-2 text-amber-500 font-bold uppercase text-xs tracking-widest">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    {worker.category}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Left Panel Actions - Moved below image like products */}
                    <div className="space-y-4 mt-auto">
                        <a
                            href={`tel:${worker.phone}`}
                            className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-[#1a120b] font-black rounded-2xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95"
                        >
                            <Phone className="w-5 h-5" />
                            Contact Now
                        </a>
                        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center gap-4">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">Verification Status</p>
                                <p className="text-amber-100 font-bold text-sm">Aadhar Verified Expert</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Detailed Info */}
                <div className="w-full md:w-3/5 p-8 md:overflow-y-auto">
                    <div className="space-y-8">
                        {/* Section: Professional Summary */}
                        <div className="space-y-4">
                            <h3 className="text-amber-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                About the Expert
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <p className="text-[10px] text-amber-100/40 uppercase font-black mb-1">Age</p>
                                    <p className="text-amber-100 font-bold text-lg flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-amber-500" />
                                        {worker.age} Years
                                    </p>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <p className="text-[10px] text-amber-100/40 uppercase font-black mb-1">Total Rating</p>
                                    <p className="text-amber-100 font-bold text-lg flex items-center gap-2">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        4.8/5.0
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section: Location & Contact */}
                        <div className="space-y-4">
                            <h3 className="text-amber-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Service Location
                            </h3>
                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl group hover:border-amber-500/30 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-amber-100 font-semibold leading-relaxed">
                                            {worker.address}
                                        </p>
                                        <p className="text-amber-100/40 text-xs">Serving in and around your selected locality</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Contact Details */}
                        <div className="space-y-4">
                            <h3 className="text-amber-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Official Contact
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-amber-100/40 uppercase font-black">Direct Phone</p>
                                        <p className="text-amber-100 font-bold">+91 {worker.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Registered By Branding Card */}
                        <div className="pt-6 border-t border-amber-500/10">
                            <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-[#1a120b] font-black italic">
                                    G
                                </div>
                                <div>
                                    <p className="text-[10px] text-amber-500/60 font-black uppercase tracking-[0.2em]">Verified by</p>
                                    <p className="text-amber-100 font-black text-sm">Grihvo Expert Network</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDetailModal;
