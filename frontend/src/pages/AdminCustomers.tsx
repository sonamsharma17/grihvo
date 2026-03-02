import { useState, useEffect } from 'react'
import { Search, Mail, Phone, Plus, X, User } from 'lucide-react'
import { getAllUsers, createUser, User as UserType } from '../api/superAdminService'

const AdminCustomers = () => {
    const [users, setUsers] = useState<UserType[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddUserModal, setShowAddUserModal] = useState(false)
    const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', password: '' })
    const [createLoading, setCreateLoading] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, searchQuery])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await getAllUsers()
            if (response.success) {
                setUsers(response.users)
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        if (!searchQuery) {
            setFilteredUsers(users)
            return
        }

        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery)
        )
        setFilteredUsers(filtered)
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setCreateLoading(true);
            await createUser(newUser);
            setShowAddUserModal(false);
            setNewUser({ name: '', email: '', phone: '', password: '' });
            fetchUsers();
            alert('User created successfully');
        } catch (error: any) {
            console.error('Error creating user:', error);
            alert(error.response?.data?.message || 'Failed to create user');
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <div className="bg-transparent">
            {/* Content */}
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-black text-amber-100 mb-2 mt-4">
                                Registered{' '}
                                <span className="text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">
                                    Customers
                                </span>
                            </h1>
                            <p className="text-amber-100/70">Manage all registered customer accounts</p>
                        </div>
                        <button
                            onClick={() => setShowAddUserModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Add User
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-[#2d1a0a]/60 backdrop-blur-md border border-amber-500/20 rounded-xl p-6 mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-100/40" />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[#1a120b]/60 border border-amber-500/30 rounded-lg text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/50"
                        />
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-[#2d1a0a]/60 backdrop-blur-md border border-amber-500/20 rounded-xl overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <p className="text-amber-100/70">Loading customers...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-amber-100/70">No customers found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#1a120b]/60 border-b border-amber-500/20">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/80 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/80 uppercase tracking-wider">
                                            Contact Info
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/80 uppercase tracking-wider">
                                            Joined Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-500/10">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-[#1a120b]/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                                        <User className="w-5 h-5 text-amber-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-amber-100">{user.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-amber-100/70">
                                                        <Mail className="w-4 h-4 text-amber-500/60" />
                                                        {user.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-amber-100/70">
                                                        <Phone className="w-4 h-4 text-amber-500/60" />
                                                        {user.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-amber-100/70">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {/* Add User Modal */}
            {showAddUserModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#2d1a0a] border border-amber-500/30 rounded-2xl p-6 max-w-md w-full relative">
                        <button
                            onClick={() => setShowAddUserModal(false)}
                            className="absolute top-4 right-4 text-amber-100/60 hover:text-amber-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold text-amber-100 mb-4">Add New User</h3>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm text-amber-100/70 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a120b]/60 border border-amber-500/30 rounded-lg text-amber-100 focus:border-amber-500/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-amber-100/70 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a120b]/60 border border-amber-500/30 rounded-lg text-amber-100 focus:border-amber-500/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-amber-100/70 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a120b]/60 border border-amber-500/30 rounded-lg text-amber-100 focus:border-amber-500/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-amber-100/70 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a120b]/60 border border-amber-500/30 rounded-lg text-amber-100 focus:border-amber-500/50 outline-none"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddUserModal(false)}
                                    className="flex-1 px-4 py-2 bg-[#1a120b]/60 border border-amber-500/30 text-amber-100 font-semibold rounded-lg hover:bg-[#1a120b]/80"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {createLoading ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminCustomers
