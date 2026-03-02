import { Package, TrendingUp, DollarSign, Truck } from 'lucide-react'

interface Step3CapacityProps {
    formData: {
        serviceType: string
        dailyCapacity: string
        minOrderValue: string
        deliveryAvailable: boolean
        deliveryCharge: string
    }
    updateFormData: (field: string, value: any) => void
}

const Step3Capacity = ({ formData, updateFormData }: Step3CapacityProps) => {
    const serviceTypes = [
        {
            id: 'retail',
            title: 'Sell Products',
            description: 'Retail sales to individual customers',
            icon: '🏪'
        },
        {
            id: 'wholesale',
            title: 'Supply Bulk',
            description: 'Wholesale supply to businesses',
            icon: '📦'
        },
        {
            id: 'both',
            title: 'Both',
            description: 'Retail and wholesale operations',
            icon: '🔄'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Service Type Selection */}
            <div>
                <label className="block text-amber-100/80 mb-3 text-sm font-semibold">
                    Service Type <span className="text-red-400">*</span>
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                    {serviceTypes.map((type) => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => updateFormData('serviceType', type.id)}
                            className={`p-4 rounded-lg border-2 text-left ${formData.serviceType === type.id
                                    ? 'border-amber-500 bg-amber-500/10'
                                    : 'border-amber-500/20 bg-[#1a120b]/60 hover:border-amber-500/40'
                                }`}
                        >
                            <div className="text-3xl mb-2">{type.icon}</div>
                            <h3 className="text-amber-100 font-bold mb-1">{type.title}</h3>
                            <p className="text-amber-100/60 text-xs">{type.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Daily Orders Capacity */}
            <div>
                <label htmlFor="dailyCapacity" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Daily Orders Capacity <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type="number"
                        id="dailyCapacity"
                        value={formData.dailyCapacity}
                        onChange={(e) => updateFormData('dailyCapacity', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="How many orders can you handle per day?"
                        min="1"
                        required
                    />
                </div>
                <p className="text-amber-100/50 text-xs mt-1">
                    Enter the maximum number of orders you can fulfill daily
                </p>
            </div>

            {/* Minimum Order Value */}
            <div>
                <label htmlFor="minOrderValue" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Minimum Order Value <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <span className="absolute left-12 top-1/2 -translate-y-1/2 text-amber-100/60">₹</span>
                    <input
                        type="number"
                        id="minOrderValue"
                        value={formData.minOrderValue}
                        onChange={(e) => updateFormData('minOrderValue', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-16 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="0"
                        min="0"
                        required
                    />
                </div>
                <p className="text-amber-100/50 text-xs mt-1">
                    Set to 0 for no minimum order requirement
                </p>
            </div>

            {/* Delivery Options */}
            <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                    <Truck className="w-6 h-6 text-amber-400 mt-1" />
                    <div className="flex-1">
                        <h3 className="text-amber-100 font-bold mb-1">Delivery Service</h3>
                        <p className="text-amber-100/60 text-sm mb-4">
                            Do you offer delivery service to your customers?
                        </p>

                        {/* Delivery Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={formData.deliveryAvailable}
                                    onChange={(e) => updateFormData('deliveryAvailable', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-[#2d1a0a] rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-orange-600 border border-amber-500/30"></div>
                                <div className="absolute left-1 top-1 w-5 h-5 bg-amber-100 rounded-full transition-transform peer-checked:translate-x-7"></div>
                            </div>
                            <span className="text-amber-100 font-semibold">
                                {formData.deliveryAvailable ? 'Delivery Available' : 'No Delivery'}
                            </span>
                        </label>
                    </div>
                </div>

                {/* Delivery Charge (shown only if delivery is available) */}
                {formData.deliveryAvailable && (
                    <div className="mt-4 pt-4 border-t border-amber-500/20">
                        <label htmlFor="deliveryCharge" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                            Delivery Charge
                        </label>
                        <div className="relative">
                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                            <span className="absolute left-12 top-1/2 -translate-y-1/2 text-amber-100/60">₹</span>
                            <input
                                type="number"
                                id="deliveryCharge"
                                value={formData.deliveryCharge}
                                onChange={(e) => updateFormData('deliveryCharge', e.target.value)}
                                className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-16 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                                placeholder="0"
                                min="0"
                            />
                        </div>
                        <p className="text-amber-100/50 text-xs mt-1">
                            Fixed delivery charge per order. Set to 0 for free delivery.
                        </p>
                    </div>
                )}
            </div>

            {/* Info Note */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-100/70 text-sm">
                    <span className="font-semibold text-amber-300">Note:</span> Your capacity settings help us
                    manage order flow and ensure you're not overwhelmed. You can adjust these settings anytime
                    from your dashboard based on your business needs.
                </p>
            </div>
        </div>
    )
}

export default Step3Capacity
