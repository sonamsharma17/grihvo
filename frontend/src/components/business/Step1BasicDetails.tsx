import { useState } from 'react'
import { Building2, User, Phone, Mail, CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react'

interface Step1BasicDetailsProps {
    formData: {
        businessName: string
        ownerName: string
        mobile: string
        email: string
        businessCategory: string
        password: string
        confirmPassword: string
    }
    updateFormData: (field: string, value: string) => void
}

const Step1BasicDetails = ({ formData, updateFormData }: Step1BasicDetailsProps) => {
    const [otpSent, setOtpSent] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [otp, setOtp] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const businessCategories = [
        'Hardware Store',
        'Electrical Supplies',
        'Plumbing Supplies',
        'Paint & Coating',
        'Cement & Concrete',
        'Steel & Iron',
        'Tiles & Flooring',
        'Sanitary Ware',
        'Doors & Windows',
        'Roofing Materials',
        'Building Materials (General)',
        'Other'
    ]

    const handleSendOTP = () => {
        if (formData.mobile.length === 10) {
            // TODO: Integrate with backend OTP service
            setOtpSent(true)
            console.log('OTP sent to:', formData.mobile)
        }
    }

    const handleVerifyOTP = () => {
        setIsVerifying(true)
        // TODO: Integrate with backend OTP verification
        setTimeout(() => {
            setOtpVerified(true)
            setIsVerifying(false)
            console.log('OTP verified')
        }, 1000)
    }

    return (
        <div className="space-y-6">
            {/* Business Name */}
            <div>
                <label htmlFor="businessName" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Business Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type="text"
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => updateFormData('businessName', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="Enter your business name"
                        required
                    />
                </div>
            </div>

            {/* Owner Name */}
            <div>
                <label htmlFor="ownerName" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Owner Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type="text"
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={(e) => updateFormData('ownerName', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="Enter owner's full name"
                        required
                    />
                </div>
            </div>

            {/* Mobile Number with OTP */}
            <div>
                <label htmlFor="mobile" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Mobile Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type="tel"
                        id="mobile"
                        value={formData.mobile}
                        onChange={(e) => updateFormData('mobile', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-32 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="10-digit mobile number"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                        disabled={otpVerified}
                    />
                    {!otpVerified && (
                        <button
                            type="button"
                            onClick={handleSendOTP}
                            disabled={formData.mobile.length !== 10 || otpSent}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-md text-sm font-semibold ${formData.mobile.length === 10 && !otpSent
                                ? 'bg-amber-500 text-[#1a120b] hover:bg-amber-600'
                                : 'bg-[#2d1a0a]/60 text-amber-100/40 cursor-not-allowed'
                                }`}
                        >
                            {otpSent ? 'Sent' : 'Send OTP'}
                        </button>
                    )}
                    {otpVerified && (
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    )}
                </div>

                {/* OTP Input */}
                {otpSent && !otpVerified && (
                    <div className="mt-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="flex-1 bg-[#1a120b]/60 border border-amber-500/30 rounded-lg px-4 py-2 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                            />
                            <button
                                type="button"
                                onClick={handleVerifyOTP}
                                disabled={otp.length !== 6 || isVerifying}
                                className={`px-6 py-2 rounded-lg font-semibold ${otp.length === 6
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-[#2d1a0a]/60 text-amber-100/40 cursor-not-allowed'
                                    }`}
                            >
                                {isVerifying ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                        <p className="text-amber-100/50 text-xs mt-2">
                            OTP sent to {formData.mobile}.{' '}
                            <button
                                type="button"
                                onClick={handleSendOTP}
                                className="text-amber-400 hover:text-amber-300 font-semibold"
                            >
                                Resend OTP
                            </button>
                        </p>
                    </div>
                )}

                {otpVerified && (
                    <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Mobile number verified successfully
                    </p>
                )}
            </div>

            {/* Email (Optional) */}
            <div>
                <label htmlFor="email" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Email Address <span className="text-amber-100/40 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="your.email@example.com"
                    />
                </div>
            </div>

            {/* Business Category */}
            <div>
                <label htmlFor="businessCategory" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Business Type <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <select
                        id="businessCategory"
                        value={formData.businessCategory}
                        onChange={(e) => updateFormData('businessCategory', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/60 appearance-none cursor-pointer"
                        required
                    >
                        <option value="" className="bg-[#1a120b] text-amber-100/40">
                            Select business category
                        </option>
                        {businessCategories.map((category) => (
                            <option key={category} value={category} className="bg-[#1a120b] text-amber-100">
                                {category}
                            </option>
                        ))}
                    </select>
                    <svg
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-12 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="Create a password"
                        minLength={8}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-400"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                <p className="text-amber-100/50 text-xs mt-1">Minimum 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
                <label htmlFor="confirmPassword" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                        className={`w-full bg-[#1a120b]/60 border rounded-lg pl-12 pr-12 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none ${formData.confirmPassword && formData.password !== formData.confirmPassword
                                ? 'border-red-500/50 focus:border-red-500/60'
                                : 'border-amber-500/30 focus:border-amber-500/60'
                            }`}
                        placeholder="Re-enter your password"
                        minLength={8}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-400"
                    >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Passwords match
                    </p>
                )}
            </div>

            {/* Info Note */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-100/70 text-sm">
                    <span className="font-semibold text-amber-300">Note:</span> Make sure all information is accurate.
                    Your mobile number will be used for order notifications and customer communication.
                </p>
            </div>
        </div>
    )
}

export default Step1BasicDetails
