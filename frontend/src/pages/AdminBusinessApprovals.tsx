import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Search, Plus } from 'lucide-react'
import { getAllBusinesses, updateBusinessStatus } from '../api/businessService'

interface Business {
    _id: string
    businessName: string
    ownerName: string
    mobile: string
    email: string
    businessCategory: string
    address: string
    city: string
    pincode: string
    status: 'pending' | 'approved' | 'rejected'
    rejectionReason?: string
    createdAt: string
}

const AdminBusinessApprovals = () => {
    const navigate = useNavigate()
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        fetchBusinesses()
    }, [])

    useEffect(() => {
        filterBusinesses()
    }, [businesses, filter, searchQuery])

    const fetchBusinesses = async () => {
        try {
            setLoading(true)
            const response = await getAllBusinesses()
            setBusinesses(response.businesses)
        } catch (error) {
            console.error('Error fetching businesses:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterBusinesses = () => {
        let filtered = businesses

        // Filter by status
        if (filter !== 'all') {
            filtered = filtered.filter(b => b.status === filter)
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(b =>
                b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.city.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredBusinesses(filtered)
    }

    const handleApprove = async (businessId: string) => {
        try {
            setActionLoading(businessId)
            await updateBusinessStatus(businessId, 'approved')
            await fetchBusinesses()
        } catch (error) {
            console.error('Error approving business:', error)
            alert('Failed to approve business')
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async () => {
        if (!selectedBusiness || !rejectReason.trim()) {
            alert('Please provide a rejection reason')
            return
        }

        try {
            setActionLoading(selectedBusiness._id)
            await updateBusinessStatus(selectedBusiness._id, 'rejected', rejectReason)
            await fetchBusinesses()
            setShowRejectModal(false)
            setRejectReason('')
            setSelectedBusiness(null)
        } catch (error) {
            console.error('Error rejecting business:', error)
            alert('Failed to reject business')
        } finally {
            setActionLoading(null)
        }
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
            approved: 'bg-green-500/20 text-green-300 border-green-500/30',
            rejected: 'bg-red-500/20 text-red-300 border-red-500/30'
        }
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        )
    }

    const stats = {
        total: businesses.length,
        pending: businesses.filter(b => b.status === 'pending').length,
        approved: businesses.filter(b => b.status === 'approved').length,
        rejected: businesses.filter(b => b.status === 'rejected').length
    }

    return (
        <div className="bg-transparent">
            {/* Content */}
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-amber-100 mb-2 mt-4">
                            Business{' '}
                            <span className="text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">
                                Approvals
                            </span>
                        </h1>
                        <p className="text-amber-100/70">Manage and review business applications</p>
                    </div>
                    <button
                        onClick={() => navigate('/business/register')}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Vendor
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#2d1a0a]/60 backdrop-blur-md border border-amber-500/20 rounded-xl p-4">
                        <p className="text-amber-100/60 text-sm">Total Applications</p>
                        <p className="text-3xl font-bold text-amber-100">{stats.total}</p>
                    </div>
                    <div className="bg-[#2d1a0a]/60 backdrop-blur-md border border-amber-500/20 rounded-xl p-4">
                        <p className="text-amber-100/60 text-sm">Pending</p>
                        <p className="text-3xl font-bold text-amber-300">{stats.pending}</p>
                    </div>
                    <div className="bg-[#2d1a0a]/60 backdrop-blur-md border border-green-500/20 rounded-xl p-4">
                        <p className="text-amber-100/60 text-sm">Approved</p>
                        <p className="text-3xl font-bold text-green-300">{stats.approved}</p>
                    </div>
                    <div className="bg-[#2d1a0a]/60 backdrop-blur-md border border-red-500/20 rounded-xl p-4">
                        <p className="text-amber-100/60 text-sm">Rejected</p>
                        <p className="text-3xl font-bold text-red-300">{stats.rejected}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-[#2d1a0a]/60 backdrop-blur-md border border-amber-500/20 rounded-xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Filter Tabs */}
                        <div className="flex gap-2 flex-wrap">
                            {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${filter === f
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                                        : 'bg-[#1a120b]/60 text-amber-100/70 hover:text-amber-100'
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-100/40" />
                            <input
                                type="text"
                                placeholder="Search businesses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[#1a120b]/60 border border-amber-500/30 rounded-lg text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Business List */}
                <div className="bg-[#2d1a0a]/60 backdrop-blur-md border border-amber-500/20 rounded-xl overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <p className="text-amber-100/70">Loading businesses...</p>
                        </div>
                    ) : filteredBusinesses.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-amber-100/70">No businesses found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#1a120b]/60 border-b border-amber-500/20">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/80 uppercase tracking-wider">
                                            Business
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/80 uppercase tracking-wider">
                                            Owner
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/80 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/80 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-amber-100/80 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-amber-100/80 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-500/10">
                                    {filteredBusinesses.map((business) => (
                                        <tr key={business._id} className="hover:bg-[#1a120b]/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-amber-100">{business.businessName}</p>
                                                    <p className="text-sm text-amber-100/60">{business.businessCategory}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-amber-100">{business.ownerName}</p>
                                                    <p className="text-sm text-amber-100/60">{business.mobile}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-amber-100">{business.city}</p>
                                                <p className="text-sm text-amber-100/60">{business.pincode}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(business.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-amber-100/70">
                                                    {new Date(business.createdAt).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-end">
                                                    {business.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(business._id)}
                                                                disabled={actionLoading === business._id}
                                                                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                                                            >
                                                                <CheckCircle className="w-4 h-4 inline mr-1" />
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedBusiness(business)
                                                                    setShowRejectModal(true)
                                                                }}
                                                                disabled={actionLoading === business._id}
                                                                className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-semibold rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                                                            >
                                                                <XCircle className="w-4 h-4 inline mr-1" />
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {business.status === 'rejected' && business.rejectionReason && (
                                                        <p className="text-xs text-red-300/70 italic">
                                                            Reason: {business.rejectionReason}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#2d1a0a] border border-amber-500/30 rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-amber-100 mb-4">Reject Business Application</h3>
                        <p className="text-amber-100/70 mb-4">
                            Please provide a reason for rejecting <span className="font-semibold text-amber-300">{selectedBusiness?.businessName}</span>
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full px-4 py-3 bg-[#1a120b]/60 border border-amber-500/30 rounded-lg text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/50 mb-4"
                            rows={4}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false)
                                    setRejectReason('')
                                    setSelectedBusiness(null)
                                }}
                                className="flex-1 px-4 py-2 bg-[#1a120b]/60 border border-amber-500/30 text-amber-100 font-semibold rounded-lg hover:bg-[#1a120b]/80"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectReason.trim() || actionLoading !== null}
                                className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 font-semibold rounded-lg hover:bg-red-500/30 disabled:opacity-50"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminBusinessApprovals
