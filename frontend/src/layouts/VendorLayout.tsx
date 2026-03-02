import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronDown,
    Menu,
    MessageSquare,
    Users
} from 'lucide-react';
import { logout } from '../api/authService';

const VendorLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();


    // Close sidebar on mobile when route changes
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleProfile = () => setProfileOpen(!isProfileOpen);

    return (
        <div className="min-h-screen bg-[#1a120b] flex flex-col text-amber-100 overflow-hidden">
            {/* Top Navbar */}
            <header className="bg-[#2d1a0a]/80 backdrop-blur-sm border-b border-amber-500/20 h-16 flex items-center justify-between px-6 lg:px-8 z-50 relative shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-1 text-amber-100/70 hover:text-amber-400 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Grihvo" className="h-10 w-auto object-contain" />
                    </div>
                    <div className="h-6 w-px bg-amber-500/20 mx-2 hidden md:block"></div>
                    <h1 className="text-lg font-semibold text-amber-100/80 uppercase tracking-wide hidden md:block">
                        Admin Dashboard
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/70" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 bg-[#1a120b] border border-amber-500/20 rounded-full text-sm text-amber-100 placeholder-amber-500/30 focus:outline-none focus:border-amber-500 w-64"
                        />
                    </div>
                    <button className="relative p-2 text-amber-100/70 hover:text-amber-400 hover:bg-amber-500/10 rounded-full transition-colors">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#2d1a0a]"></span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={toggleProfile}
                            className="flex items-center gap-3 pl-4 border-l border-amber-500/20 focus:outline-none group"
                        >
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                                <Users className="w-5 h-5 text-amber-400" />
                            </div>
                            <span className="hidden md:block text-sm font-medium text-amber-100 group-hover:text-amber-400 transition-colors">Admin</span>
                            <ChevronDown className={`w-4 h-4 text-amber-500/70 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#2d1a0a] border border-amber-500/20 rounded-lg shadow-xl py-1 z-50">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-amber-100/80 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>


            {/* Layout Container */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar */}
                <aside
                    onClick={() => {
                        if (window.innerWidth < 1024) {
                            setSidebarOpen(false);
                        }
                    }}
                    className={`absolute inset-y-0 left-0 z-40 w-64 bg-[#2d1a0a] border-r border-amber-500/20 transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } lg:static lg:translate-x-0`}
                >
                    <nav className="h-full px-4 py-6 space-y-2 overflow-y-auto">
                        <NavItem icon={<LayoutDashboard />} label="Dashboard" to="/vendor/dashboard" active={location.pathname === '/vendor/dashboard'} />
                        <NavItem icon={<Package />} label="Products" to="/vendor/products" active={location.pathname === '/vendor/products'} />
                        <NavItem icon={<ShoppingCart />} label="Orders" to="/vendor/orders" active={location.pathname === '/vendor/orders'} />
                        <NavItem icon={<MessageSquare />} label="Messages" to="/vendor/messages" active={location.pathname === '/vendor/messages'} />

                        <div className="pt-4 mt-6 border-t border-amber-500/20">
                            <p className="px-4 text-xs font-semibold text-amber-500/80 uppercase tracking-wider mb-2">
                                Settings
                            </p>
                            <NavItem icon={<Settings />} label="Settings" to="/vendor/settings" active={location.pathname === '/vendor/settings'} />
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-3 text-amber-100/70 transition-colors rounded-lg hover:bg-amber-500/10 hover:text-amber-400"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#1a120b] relative">
                    {/* Background Elements */}
                    <div className="absolute inset-0 pointer-events-none -z-10"
                        style={{
                            backgroundImage: `linear-gradient(rgba(251, 191, 36, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.03) 1px, transparent 1px)`,
                            backgroundSize: '50px 50px'
                        }}
                    />

                    <main className="flex-1 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const NavItem = ({ icon, label, to = "#", active = false }: { icon: React.ReactNode, label: string, to?: string, active?: boolean }) => (
    <Link
        to={to}
        className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg mb-1
        ${active
                ? 'bg-amber-500 text-[#1a120b] shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'text-amber-100/70 hover:bg-amber-500/10 hover:text-amber-400'
            }`}
    >
        <span className="w-5 h-5 mr-3">{icon}</span>
        {label}
    </Link>
);

export default VendorLayout;
