import { useState } from 'react'
import { CheckCircle2, Edit, AlertCircle, Loader2 } from 'lucide-react'

interface ReviewSubmitProps {
    formData: any
    onEdit: (step: number) => void
    onSubmit: () => Promise<void>
}

const ReviewSubmit = ({ formData, onEdit, onSubmit }: ReviewSubmitProps) => {
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!termsAccepted) {
            alert('Please accept the terms and conditions to proceed')
            return
        }

        setIsSubmitting(true)

        try {
            await onSubmit()
            // Parent component handles navigation on success
        } catch (error: any) {
            console.error('Error submitting registration:', error)
            alert(`Failed to submit registration: ${error.message || 'Unknown error'}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-amber-100 mb-2">Review Your Information</h2>
                <p className="text-amber-100/60">
                    Please review all details before submitting your registration
                </p>
            </div>

            {/* Step 1: Basic Details */}
            <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-amber-100">1. Basic Details</h3>
                    <button
                        onClick={() => onEdit(1)}
                        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                        <span className="text-amber-100/60">Business Name:</span>
                        <p className="text-amber-100 font-semibold">{formData.businessName || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Owner Name:</span>
                        <p className="text-amber-100 font-semibold">{formData.ownerName || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Mobile:</span>
                        <p className="text-amber-100 font-semibold">{formData.mobile || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Email:</span>
                        <p className="text-amber-100 font-semibold">{formData.email || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <span className="text-amber-100/60">Business Category:</span>
                        <p className="text-amber-100 font-semibold">{formData.businessCategory || 'Not provided'}</p>
                    </div>
                </div>
            </div>

            {/* Step 2: Location */}
            <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-amber-100">2. Location</h3>
                    <button
                        onClick={() => onEdit(2)}
                        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="md:col-span-2">
                        <span className="text-amber-100/60">Address:</span>
                        <p className="text-amber-100 font-semibold">{formData.address || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">City:</span>
                        <p className="text-amber-100 font-semibold">{formData.city || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Pincode:</span>
                        <p className="text-amber-100 font-semibold">{formData.pincode || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Service Radius:</span>
                        <p className="text-amber-100 font-semibold">{formData.serviceRadius} km</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Landmark:</span>
                        <p className="text-amber-100 font-semibold">{formData.landmark || 'Not provided'}</p>
                    </div>
                </div>
            </div>

            {/* Step 3: Capacity */}
            <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-amber-100">3. Capacity</h3>
                    <button
                        onClick={() => onEdit(3)}
                        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                        <span className="text-amber-100/60">Service Type:</span>
                        <p className="text-amber-100 font-semibold capitalize">{formData.serviceType || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Daily Capacity:</span>
                        <p className="text-amber-100 font-semibold">{formData.dailyCapacity || 'Not provided'} orders/day</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Min Order Value:</span>
                        <p className="text-amber-100 font-semibold">₹{formData.minOrderValue || '0'}</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Delivery:</span>
                        <p className="text-amber-100 font-semibold">
                            {formData.deliveryAvailable ? `Available (₹${formData.deliveryCharge || '0'})` : 'Not Available'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Step 4: Products */}
            <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-amber-100">4. Products</h3>
                    <button
                        onClick={() => onEdit(4)}
                        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                </div>
                <div className="text-sm">
                    <span className="text-amber-100/60">Categories ({formData.categories?.length || 0}):</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.categories?.length > 0 ? (
                            formData.categories.map((cat: string) => (
                                <span key={cat} className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-100 text-xs">
                                    {cat}
                                </span>
                            ))
                        ) : (
                            <p className="text-amber-100/60">No categories selected</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Step 5: Legal */}
            <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-amber-100">5. Legal Documents</h3>
                    <button
                        onClick={() => onEdit(5)}
                        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                        <span className="text-amber-100/60">GST Number:</span>
                        <p className="text-amber-100 font-semibold">{formData.gstNumber || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">PAN Card:</span>
                        <p className="text-amber-100 font-semibold">{formData.panCard || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <span className="text-amber-100/60">ID Proof:</span>
                        <p className="text-amber-100 font-semibold">{formData.idProof?.name || 'Not uploaded'}</p>
                    </div>
                </div>
            </div>

            {/* Step 6: Working Hours */}
            <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-amber-100">6. Working Hours</h3>
                    <button
                        onClick={() => onEdit(6)}
                        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="md:col-span-2">
                        <span className="text-amber-100/60">Working Days:</span>
                        <p className="text-amber-100 font-semibold capitalize">
                            {formData.workingDays?.join(', ') || 'Not selected'}
                        </p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Timings:</span>
                        <p className="text-amber-100 font-semibold">
                            {formData.openTime && formData.closeTime
                                ? `${formData.openTime} - ${formData.closeTime}`
                                : 'Not provided'}
                        </p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Emergency Orders:</span>
                        <p className="text-amber-100 font-semibold">{formData.emergencyOrders ? 'Enabled' : 'Disabled'}</p>
                    </div>
                </div>
            </div>

            {/* Step 7: Payment */}
            <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-amber-100">7. Payment Details</h3>
                    <button
                        onClick={() => onEdit(7)}
                        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                        <span className="text-amber-100/60">Account Holder:</span>
                        <p className="text-amber-100 font-semibold">{formData.accountHolder || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Account Number:</span>
                        <p className="text-amber-100 font-semibold">{formData.accountNumber || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">IFSC Code:</span>
                        <p className="text-amber-100 font-semibold">{formData.ifsc || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="text-amber-100/60">Payout Cycle:</span>
                        <p className="text-amber-100 font-semibold capitalize">{formData.payoutCycle || 'Not selected'}</p>
                    </div>
                </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-5 h-5 mt-0.5 rounded border-amber-500/30 bg-[#1a120b]/60 text-amber-500 focus:ring-amber-500/50"
                    />
                    <div className="flex-1">
                        <p className="text-amber-100 text-sm">
                            I agree to the{' '}
                            <a href="#" className="text-amber-400 hover:text-amber-300 font-semibold underline">
                                Terms & Conditions
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-amber-400 hover:text-amber-300 font-semibold underline">
                                Privacy Policy
                            </a>
                        </p>
                        <p className="text-amber-100/60 text-xs mt-1">
                            By submitting, you confirm that all information provided is accurate and complete.
                        </p>
                    </div>
                </label>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={handleSubmit}
                    disabled={!termsAccepted || isSubmitting}
                    className={`w-full md:w-auto px-12 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 ${termsAccepted && !isSubmitting
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-xl'
                        : 'bg-[#2d1a0a]/60 text-amber-100/40 cursor-not-allowed'
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-6 h-6" />
                            Submit Registration
                        </>
                    )}
                </button>

                {!termsAccepted && !isSubmitting && (
                    <div className="flex items-center gap-2 text-amber-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Please accept terms & conditions to submit</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReviewSubmit
