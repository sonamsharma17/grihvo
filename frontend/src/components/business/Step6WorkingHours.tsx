import { Clock, Calendar, AlertCircle } from 'lucide-react'

interface Step6WorkingHoursProps {
    formData: {
        workingDays: string[]
        openTime: string
        closeTime: string
        emergencyOrders: boolean
    }
    updateFormData: (field: string, value: any) => void
}

const Step6WorkingHours = ({ formData, updateFormData }: Step6WorkingHoursProps) => {
    const daysOfWeek = [
        { id: 'monday', label: 'Monday', short: 'Mon' },
        { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
        { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
        { id: 'thursday', label: 'Thursday', short: 'Thu' },
        { id: 'friday', label: 'Friday', short: 'Fri' },
        { id: 'saturday', label: 'Saturday', short: 'Sat' },
        { id: 'sunday', label: 'Sunday', short: 'Sun' }
    ]

    const toggleDay = (dayId: string) => {
        const newDays = formData.workingDays.includes(dayId)
            ? formData.workingDays.filter(d => d !== dayId)
            : [...formData.workingDays, dayId]
        updateFormData('workingDays', newDays)
    }

    const selectAllDays = () => {
        updateFormData('workingDays', daysOfWeek.map(d => d.id))
    }

    const selectWeekdays = () => {
        updateFormData('workingDays', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
    }

    const clearAllDays = () => {
        updateFormData('workingDays', [])
    }

    return (
        <div className="space-y-6">
            {/* Working Days Selection */}
            <div>
                <label className="block text-amber-100/80 mb-3 text-sm font-semibold">
                    Working Days <span className="text-red-400">*</span>
                </label>
                <p className="text-amber-100/60 text-sm mb-4">
                    Select the days your business is open
                </p>

                {/* Quick Select Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        type="button"
                        onClick={selectAllDays}
                        className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-100 hover:bg-amber-500/30 text-sm font-semibold"
                    >
                        Select All
                    </button>
                    <button
                        type="button"
                        onClick={selectWeekdays}
                        className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-100 hover:bg-amber-500/30 text-sm font-semibold"
                    >
                        Weekdays Only
                    </button>
                    <button
                        type="button"
                        onClick={clearAllDays}
                        className="px-4 py-2 bg-[#1a120b]/60 border border-amber-500/30 rounded-lg text-amber-100/70 hover:bg-[#1a120b]/80 text-sm font-semibold"
                    >
                        Clear All
                    </button>
                </div>

                {/* Day Selection Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day) => (
                        <button
                            key={day.id}
                            type="button"
                            onClick={() => toggleDay(day.id)}
                            className={`p-3 rounded-lg border-2 text-center ${formData.workingDays.includes(day.id)
                                    ? 'border-amber-500 bg-amber-500/10'
                                    : 'border-amber-500/20 bg-[#1a120b]/60 hover:border-amber-500/40'
                                }`}
                        >
                            <Calendar className={`w-5 h-5 mx-auto mb-1 ${formData.workingDays.includes(day.id) ? 'text-amber-400' : 'text-amber-100/40'
                                }`} />
                            <div className="text-xs font-bold text-amber-100 hidden md:block">
                                {day.short}
                            </div>
                            <div className="text-xs font-bold text-amber-100 md:hidden">
                                {day.short[0]}
                            </div>
                        </button>
                    ))}
                </div>

                {formData.workingDays.length > 0 && (
                    <p className="text-green-400 text-sm mt-3">
                        ✓ {formData.workingDays.length} {formData.workingDays.length === 1 ? 'day' : 'days'} selected
                    </p>
                )}
            </div>

            {/* Opening and Closing Times */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Opening Time */}
                <div>
                    <label htmlFor="openTime" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                        Opening Time <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                        <input
                            type="time"
                            id="openTime"
                            value={formData.openTime}
                            onChange={(e) => updateFormData('openTime', e.target.value)}
                            className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/60"
                            required
                        />
                    </div>
                </div>

                {/* Closing Time */}
                <div>
                    <label htmlFor="closeTime" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                        Closing Time <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                        <input
                            type="time"
                            id="closeTime"
                            value={formData.closeTime}
                            onChange={(e) => updateFormData('closeTime', e.target.value)}
                            className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/60"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Time Summary */}
            {formData.openTime && formData.closeTime && (
                <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-100/70 text-sm">
                        <span className="font-semibold text-amber-300">Business Hours:</span>{' '}
                        {formData.openTime} - {formData.closeTime}
                        {(() => {
                            const [openHour, openMin] = formData.openTime.split(':').map(Number)
                            const [closeHour, closeMin] = formData.closeTime.split(':').map(Number)
                            const totalMinutes = (closeHour * 60 + closeMin) - (openHour * 60 + openMin)
                            const hours = Math.floor(totalMinutes / 60)
                            const minutes = totalMinutes % 60
                            return totalMinutes > 0 ? ` (${hours}h ${minutes}m)` : ' (Invalid time range)'
                        })()}
                    </p>
                </div>
            )}

            {/* Emergency Orders Toggle */}
            <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                        <h3 className="text-amber-100 font-bold mb-1">Emergency Orders</h3>
                        <p className="text-amber-100/60 text-sm mb-4">
                            Accept urgent orders outside business hours for emergencies
                        </p>

                        {/* Toggle Switch */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={formData.emergencyOrders}
                                    onChange={(e) => updateFormData('emergencyOrders', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-[#2d1a0a] rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-orange-600 border border-amber-500/30"></div>
                                <div className="absolute left-1 top-1 w-5 h-5 bg-amber-100 rounded-full transition-transform peer-checked:translate-x-7"></div>
                            </div>
                            <span className="text-amber-100 font-semibold">
                                {formData.emergencyOrders ? 'Enabled' : 'Disabled'}
                            </span>
                        </label>

                        {formData.emergencyOrders && (
                            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                <p className="text-amber-300 text-sm">
                                    ⚡ You'll receive notifications for emergency orders even outside business hours.
                                    Additional charges may apply for emergency services.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Note */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-100/70 text-sm">
                    <span className="font-semibold text-amber-300">Note:</span> Your working hours help customers
                    know when to expect service. You can update these settings anytime from your dashboard.
                    Emergency orders allow you to serve urgent customer needs and can increase your revenue.
                </p>
            </div>
        </div>
    )
}

export default Step6WorkingHours
