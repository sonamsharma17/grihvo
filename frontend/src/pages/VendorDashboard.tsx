import { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import {
    ShoppingBag,
    IndianRupee,
    Package,
    Users,
    TrendingUp,
    ArrowUpRight,
    Search,
    Filter,
    MoreHorizontal
} from 'lucide-react';
import { getDashboardStats, getRecentOrders, DashboardStats, Order } from '../api/dashboardService';

const VendorDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const salesData = [
        { name: 'Jan', sales: 4000 },
        { name: 'Feb', sales: 3000 },
        { name: 'Mar', sales: 2000 },
        { name: 'Apr', sales: 2780 },
        { name: 'May', sales: 1890 },
        { name: 'Jun', sales: 2390 },
        { name: 'Jul', sales: 3490 },
        { name: 'Aug', sales: 4000 },
        { name: 'Sep', sales: 3000 },
        { name: 'Oct', sales: 2000 },
        { name: 'Nov', sales: 2780 },
        { name: 'Dec', sales: 3890 },
    ];

    const revenueData = [
        { name: 'Mon', revenue: 4000 },
        { name: 'Tue', revenue: 3000 },
        { name: 'Wed', revenue: 2000 },
        { name: 'Thu', revenue: 2780 },
        { name: 'Fri', revenue: 1890 },
        { name: 'Sat', revenue: 2390 },
        { name: 'Sun', revenue: 3490 },
    ];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, ordersRes] = await Promise.all([
                getDashboardStats(),
                getRecentOrders(5)
            ]);

            if (statsRes.success) setStats(statsRes.stats);
            if (ordersRes.success) setRecentOrders(ordersRes.orders);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 ml-6 mr-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Orders */}
                <div className="bg-[#2d1a0a] p-6 rounded-xl shadow-lg border border-blue-500/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-amber-100/60">Total Orders</p>
                            <h3 className="text-2xl font-bold text-amber-100 mt-2">{stats?.totalOrders || 0}</h3>
                            <div className="flex items-center mt-1 text-green-400 text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span>+12.5%</span>
                                <span className="text-amber-100/40 ml-1">from last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <ShoppingBag className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-[#2d1a0a] p-6 rounded-xl shadow-lg border border-green-500/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-amber-100/60">Total Earnings</p>
                            <h3 className="text-2xl font-bold text-amber-100 mt-2">₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}</h3>
                            <div className="flex items-center mt-1 text-green-400 text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span>+8.2%</span>
                                <span className="text-amber-100/40 ml-1">from last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <IndianRupee className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="bg-[#2d1a0a] p-6 rounded-xl shadow-lg border border-amber-500/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-amber-100/60">Products</p>
                            <h3 className="text-2xl font-bold text-amber-100 mt-2">{stats?.totalProducts || 0}</h3>
                            <div className="flex items-center mt-1 text-sm">
                                <span className="text-amber-400 font-medium">{stats?.lowStockProducts || 0}</span>
                                <span className="text-amber-100/40 ml-1">low stock alerts</span>
                            </div>
                        </div>
                        <div className="p-3 bg-amber-500/10 rounded-lg">
                            <Package className="w-6 h-6 text-amber-500" />
                        </div>
                    </div>
                </div>

                {/* Customers */}
                <div className="bg-[#2d1a0a] p-6 rounded-xl shadow-lg border border-purple-500/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-amber-100/60">Total Customers</p>
                            <h3 className="text-2xl font-bold text-amber-100 mt-2">1,240</h3>
                            <div className="flex items-center mt-1 text-green-400 text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span>+4.3%</span>
                                <span className="text-amber-100/40 ml-1">from last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Overview */}
                <div className="lg:col-span-2 bg-[#2d1a0a] p-6 rounded-xl shadow-lg border border-amber-500/10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-amber-100">Sales Overview</h3>
                        <div className="flex items-center gap-2">
                            <select className="bg-[#1a120b] border border-amber-500/20 text-amber-100/80 text-sm rounded-lg p-2 focus:outline-none focus:border-amber-500/50">
                                <option>This Month</option>
                                <option>Last 3 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f59e0b20" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#fcd34d60' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#fcd34d60' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#2d1a0a',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(245, 158, 11, 0.2)',
                                        color: '#fcd34d'
                                    }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Bar Chart */}
                <div className="bg-[#2d1a0a] p-6 rounded-xl shadow-lg border border-amber-500/10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-amber-100">Weekly Revenue</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f59e0b20" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#fcd34d60' }} fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: '#f59e0b10' }}
                                    contentStyle={{
                                        backgroundColor: '#2d1a0a',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(245, 158, 11, 0.2)',
                                        color: '#fcd34d'
                                    }}
                                />
                                <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-[#2d1a0a] rounded-xl shadow-lg border border-amber-500/10 overflow-hidden">
                <div className="p-6 border-b border-amber-500/10 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-amber-100">Recent Orders</h3>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-amber-500/10 rounded-lg text-amber-100/60 hover:text-amber-400 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-amber-500/10 rounded-lg text-amber-100/60 hover:text-amber-400 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#1a120b]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/60 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/60 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/60 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/60 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/60 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/60 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-500/10">
                            {recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-amber-500/5 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-amber-100">
                                        #{order.orderNumber.split('-')[1]}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-amber-100/60">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-100 mr-3">
                                                {order.customerId.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-amber-100">{order.customerId.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-amber-100">
                                        ₹{order.totalAmount.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-amber-400 cursor-pointer hover:text-amber-300">
                                        View Details
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
