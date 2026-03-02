import { useEffect, useState } from 'react';
import {
    ShoppingCart,
    Users,
    TrendingUp,
    Store,
    ChevronDown
} from 'lucide-react';
import { getSuperAdminStats, SuperAdminStats } from '../api/superAdminService';

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState<SuperAdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const statsRes = await getSuperAdminStats();
            if (statsRes.success) setStats(statsRes.stats);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a120b] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Orders"
                    value={stats?.totalOrders || 0}
                    subtext="Today: 120"
                    icon={<ShoppingCart className="w-6 h-6 text-[#1a120b]" />}
                    color="bg-amber-500"
                />
                <StatsCard
                    title="Total Sales"
                    value="₹25,75,800"
                    subtext="Today: ₹80,500"
                    icon={<TrendingUp className="w-6 h-6 text-[#1a120b]" />}
                    color="bg-amber-400"
                />
                <StatsCard
                    title="Total Sellers"
                    value={stats?.totalVendors || 0}
                    subtext="New: 5"
                    icon={<Store className="w-6 h-6 text-[#1a120b]" />}
                    color="bg-amber-600"
                />
                <StatsCard
                    title="Total Customers"
                    value={stats?.totalUsers || 0}
                    subtext="New: 22"
                    icon={<Users className="w-6 h-6 text-[#1a120b]" />}
                    color="bg-yellow-500"
                />
            </div>

            {/* Charts & Graphs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Sales Overview */}
                <div className="lg:col-span-2 bg-[#2d1a0a]/60 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-amber-100">Sales Overview</h3>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs font-medium text-amber-100/60">
                                <span className="w-3 h-3 rounded-full bg-amber-500"></span> This Month
                            </span>
                            <span className="flex items-center gap-1 text-xs font-medium text-amber-100/60">
                                <span className="w-3 h-3 rounded-full bg-amber-900 border border-amber-500/50"></span> Last Month
                            </span>
                        </div>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-2 border-b border-l border-amber-500/10 relative">
                        {/* Simple CSS Bar Chart Simulation */}
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
                            <div key={i} className="w-full bg-amber-500/5 relative group rounded-t-sm">
                                <div
                                    className="absolute bottom-0 left-1 right-1 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm transition-all duration-300 hover:bg-amber-500"
                                    style={{ height: `${height}%` }}
                                ></div>
                            </div>
                        ))}
                        {/* Y-axis Labels */}
                        <div className="absolute -left-8 bottom-0 flex flex-col justify-between h-full text-xs text-amber-100/40 py-2">
                            <span>0k</span>
                            <span>500k</span>
                            <span>1M</span>
                            <span>1.5M</span>
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-amber-100/40 px-2">
                        {['1', '4', '7', '10', '13', '16', '19', '22', '25', '28'].map(d => <span key={d}>{d}</span>)}
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-[#2d1a0a]/60 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-amber-100">Recent Orders</h3>
                        <div className="flex gap-1">
                            <button className="p-1 hover:bg-amber-500/10 rounded text-amber-500"><ChevronDown className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-amber-100/80">
                            <thead className="text-xs text-amber-500/70 uppercase bg-amber-500/5">
                                <tr>
                                    <th className="px-3 py-2">Order ID</th>
                                    <th className="px-3 py-2">Status</th>
                                    <th className="px-3 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-500/10">
                                <tr className="hover:bg-amber-500/5">
                                    <td className="px-3 py-3 font-medium text-amber-400">#10234</td>
                                    <td className="px-3 py-3"><span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">Shipped</span></td>
                                    <td className="px-3 py-3 text-right">₹1,250</td>
                                </tr>
                                <tr className="hover:bg-amber-500/5">
                                    <td className="px-3 py-3 font-medium text-amber-400">#10233</td>
                                    <td className="px-3 py-3"><span className="px-2 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full">Pending</span></td>
                                    <td className="px-3 py-3 text-right">₹850</td>
                                </tr>
                                <tr className="hover:bg-amber-500/5">
                                    <td className="px-3 py-3 font-medium text-amber-400">#10232</td>
                                    <td className="px-3 py-3"><span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">Delivered</span></td>
                                    <td className="px-3 py-3 text-right">₹3,200</td>
                                </tr>
                                <tr className="hover:bg-amber-500/5">
                                    <td className="px-3 py-3 font-medium text-amber-400">#10231</td>
                                    <td className="px-3 py-3"><span className="px-2 py-1 text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 rounded-full">Cancelled</span></td>
                                    <td className="px-3 py-3 text-right">₹450</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Top Selling Products */}
                <div className="bg-[#2d1a0a]/60 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-amber-100 mb-4">Top Selling Products</h3>
                    <div className="space-y-4">
                        <ProductItem name="Designer Lehenga" sales="1,200 Sales" rank={1} />
                        <ProductItem name="Gold Necklace Set" sales="980 Sales" rank={2} />
                        <ProductItem name="Cotton Kurti" sales="850 Sales" rank={3} />
                    </div>
                </div>

                {/* Top Sellers */}
                <div className="bg-[#2d1a0a]/60 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-amber-100 mb-4">Top Sellers</h3>
                    <div className="space-y-4">
                        <SellerItem name="FashionHub" revenue="₹5,80,000" />
                        <SellerItem name="Trendy Mart" revenue="₹4,30,000" />
                        <SellerItem name="EthnicStore" revenue="₹3,90,000" />
                    </div>
                </div>

                {/* Site Analytics */}
                <div className="bg-[#2d1a0a]/60 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-amber-100 mb-2">Site Analytics</h3>
                    <div className="flex items-center gap-4 mb-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                        <div>
                            <p className="text-xs text-amber-100/60 uppercase">Visits</p>
                            <p className="text-xl font-bold text-amber-100">28.5K</p>
                        </div>
                        <div className="h-8 w-px bg-amber-500/30"></div>
                        <div>
                            <p className="text-xs text-amber-100/60 uppercase">Revenue</p>
                            <p className="text-xl font-bold text-amber-100">₹3.2L</p>
                        </div>
                    </div>
                    <div className="h-32 flex items-end justify-between gap-1">
                        {[40, 60, 45, 75, 55, 65, 80].map((h, i) => (
                            <div key={i} className="w-full bg-amber-500/10 rounded-t-sm relative group overflow-hidden">
                                <div className={`absolute bottom-0 left-0 right-0 ${i % 2 === 0 ? 'bg-amber-500' : 'bg-amber-700'}`} style={{ height: `${h}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-amber-100/40">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
// NavItem removed as it's now in Layout

const StatsCard = ({ title, value, subtext, icon, color }: any) => (
    <div className="bg-[#2d1a0a]/60 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6 flex items-start justify-between hover:border-amber-500/40 transition-colors">
        <div>
            <div className={`p-2 rounded-lg ${color} inline-flex items-center justify-center mb-3 shadow-lg shadow-amber-900/20`}>
                {icon}
            </div>
            <h3 className="text-amber-100/60 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <p className="text-2xl font-bold text-amber-100 mt-1">{value}</p>
            <p className="text-xs text-amber-400/80 font-semibold mt-1">{subtext}</p>
        </div>
    </div>
);

const ProductItem = ({ name, sales, rank }: any) => (
    <div className="flex items-center justify-between p-3 bg-amber-500/5 rounded-lg border border-amber-500/10 hover:border-amber-500/30 transition-colors">
        <div className="flex items-center gap-3">
            <span className="w-6 h-6 flex items-center justify-center bg-[#1a120b] rounded-full text-xs font-bold text-amber-500 border border-amber-500/30">{rank}</span>
            <span className="font-medium text-amber-100/90">{name}</span>
        </div>
        <span className="text-sm font-bold text-amber-400">{sales}</span>
    </div>
);

const SellerItem = ({ name, revenue }: any) => (
    <div className="flex items-center justify-between p-3 hover:bg-amber-500/5 rounded-lg transition-colors border-b last:border-0 border-amber-500/10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Users className="w-5 h-5 text-amber-500" />
            </div>
            <span className="font-medium text-amber-100/90">{name}</span>
        </div>
        <span className="px-3 py-1 bg-[#1a120b] border border-amber-500/20 text-amber-400 text-xs font-bold rounded-md">{revenue}</span>
    </div>
);

export default SuperAdminDashboard;
