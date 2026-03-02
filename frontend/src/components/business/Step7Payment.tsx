import { CreditCard, Building2, User, Calendar } from 'lucide-react'

interface Step7PaymentProps {
    formData: {
        accountNumber: string
        ifsc: string
        accountHolder: string
        payoutCycle: string
    }
    updateFormData: (field: string, value: any) => void
}

const Step7Payment = ({ formData, updateFormData }: Step7PaymentProps) => {
    const payoutCycles = [
        { value: 'weekly', label: 'Weekly', description: 'Every Monday' },
        { value: 'biweekly', label: 'Bi-Weekly', description: 'Every 2 weeks' },
        { value: 'monthly', label: 'Monthly', description: 'First day of month' }
    ]

    return (
        <div className="space-y-6">
            {/* Success Banner */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-300 text-sm">
                    <span className="font-semibold">🎉 Almost Done!</span> Complete your payment details to start
                    receiving payments from customers. This is the final step of your registration.
                </p>
            </div>

            {/* Account Holder Name */}
            <div>
                <label htmlFor="accountHolder" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Account Holder Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type="text"
                        id="accountHolder"
                        value={formData.accountHolder}
                        onChange={(e) => updateFormData('accountHolder', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="Enter name as per bank account"
                        required
                    />
                </div>
                <p className="text-amber-100/50 text-xs mt-1">
                    Name must match your bank account records
                </p>
            </div>

            {/* Bank Account Number */}
            <div>
                <label htmlFor="accountNumber" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Bank Account Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type="text"
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) => updateFormData('accountNumber', e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="Enter bank account number"
                        maxLength={18}
                        required
                    />
                </div>
                <p className="text-amber-100/50 text-xs mt-1">
                    9 to 18 digit account number
                </p>
            </div>

            {/* IFSC Code */}
            <div>
                <label htmlFor="ifsc" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    IFSC Code <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type="text"
                        id="ifsc"
                        value={formData.ifsc}
                        onChange={(e) => updateFormData('ifsc', e.target.value.toUpperCase())}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 uppercase"
                        placeholder="SBIN0001234"
                        maxLength={11}
                        pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                        required
                    />
                </div>
                <p className="text-amber-100/50 text-xs mt-1">
                    11-character IFSC code (Format: SBIN0001234)
                </p>
            </div>

            {/* Payout Cycle */}
            <div>
                <label className="block text-amber-100/80 mb-3 text-sm font-semibold">
                    Payout Cycle <span className="text-red-400">*</span>
                </label>
                <p className="text-amber-100/60 text-sm mb-4">
                    Choose how often you want to receive payments
                </p>
                <div className="space-y-3">
                    {payoutCycles.map((cycle) => (
                        <button
                            key={cycle.value}
                            type="button"
                            onClick={() => updateFormData('payoutCycle', cycle.value)}
                            className={`w-full p-4 rounded-lg border-2 text-left ${formData.payoutCycle === cycle.value
                                    ? 'border-amber-500 bg-amber-500/10'
                                    : 'border-amber-500/20 bg-[#1a120b]/60 hover:border-amber-500/40'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Calendar className={`w-5 h-5 ${formData.payoutCycle === cycle.value ? 'text-amber-400' : 'text-amber-100/40'
                                    }`} />
                                <div className="flex-1">
                                    <h4 className="text-amber-100 font-bold">{cycle.label}</h4>
                                    <p className="text-amber-100/60 text-sm">{cycle.description}</p>
                                </div>
                                {formData.payoutCycle === cycle.value && (
                                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Info Note */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-100/70 text-sm">
                    <span className="font-semibold text-amber-300">Note:</span> Your payment details are securely
                    encrypted and will only be used for transferring your earnings. Payouts are processed after
                    deducting applicable platform fees and taxes. You can update these details anytime from your
                    dashboard.
                </p>
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-amber-100/50 text-xs">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Bank-level encryption</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>PCI DSS compliant</span>
                </div>
            </div>

            {/* Final Step Indicator */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-green-300 mb-2">
                    You're All Set!
                </h3>
                <p className="text-green-200/70 text-sm">
                    Click "Submit Registration" to complete your business registration.
                    Our team will review your application within 24-48 hours.
                </p>
            </div>
        </div>
    )
}

export default Step7Payment
