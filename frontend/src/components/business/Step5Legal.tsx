import { FileText, Upload, CheckCircle2, X } from 'lucide-react'

interface Step5LegalProps {
    formData: {
        gstNumber: string
        shopLicense: string
        panCard: string
        idProof: File | null
    }
    updateFormData: (field: string, value: any) => void
}

const Step5Legal = ({ formData, updateFormData }: Step5LegalProps) => {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB')
                return
            }
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
            if (!allowedTypes.includes(file.type)) {
                alert('Only JPG, PNG, and PDF files are allowed')
                return
            }
            updateFormData('idProof', file)
        }
    }

    const removeFile = () => {
        updateFormData('idProof', null)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                    <span className="font-semibold">ℹ️ Optional Documents:</span> GST, Shop License, and PAN Card are
                    optional but recommended for building trust with customers. ID Proof is mandatory for verification.
                </p>
            </div>

            {/* GST Number */}
            <div>
                <label htmlFor="gstNumber" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    GST Number <span className="text-amber-100/40 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type="text"
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={(e) => updateFormData('gstNumber', e.target.value.toUpperCase())}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 uppercase"
                        placeholder="22AAAAA0000A1Z5"
                        maxLength={15}
                        pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
                    />
                </div>
                <p className="text-amber-100/50 text-xs mt-1">
                    15-character GST identification number (Format: 22AAAAA0000A1Z5)
                </p>
            </div>

            {/* Shop License */}
            <div>
                <label htmlFor="shopLicense" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Shop License Number <span className="text-amber-100/40 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type="text"
                        id="shopLicense"
                        value={formData.shopLicense}
                        onChange={(e) => updateFormData('shopLicense', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="Enter shop/trade license number"
                    />
                </div>
                <p className="text-amber-100/50 text-xs mt-1">
                    Your municipal shop establishment license number
                </p>
            </div>

            {/* PAN Card */}
            <div>
                <label htmlFor="panCard" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    PAN Card Number <span className="text-amber-100/40 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type="text"
                        id="panCard"
                        value={formData.panCard}
                        onChange={(e) => updateFormData('panCard', e.target.value.toUpperCase())}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 uppercase"
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    />
                </div>
                <p className="text-amber-100/50 text-xs mt-1">
                    10-character PAN (Format: ABCDE1234F)
                </p>
            </div>

            {/* ID Proof Upload */}
            <div>
                <label className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    ID Proof Upload <span className="text-red-400">*</span>
                </label>
                <p className="text-amber-100/60 text-sm mb-3">
                    Upload Aadhaar Card, Voter ID, Driving License, or Passport
                </p>

                {!formData.idProof ? (
                    <div className="border-2 border-dashed border-amber-500/30 rounded-lg p-8 text-center hover:border-amber-500/50 transition-colors">
                        <input
                            type="file"
                            id="idProof"
                            accept="image/jpeg,image/jpg,image/png,application/pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <label
                            htmlFor="idProof"
                            className="cursor-pointer flex flex-col items-center gap-3"
                        >
                            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-amber-100 font-semibold mb-1">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-amber-100/50 text-sm">
                                    JPG, PNG or PDF (max 5MB)
                                </p>
                            </div>
                            <button
                                type="button"
                                className="px-6 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-100 hover:bg-amber-500/30 font-semibold"
                            >
                                Choose File
                            </button>
                        </label>
                    </div>
                ) : (
                    <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-amber-100 font-semibold truncate">
                                    {formData.idProof.name}
                                </p>
                                <p className="text-amber-100/60 text-sm">
                                    {formatFileSize(formData.idProof.size)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={removeFile}
                                className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center text-red-400 flex-shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Note */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-100/70 text-sm">
                    <span className="font-semibold text-amber-300">Note:</span> All documents are securely stored
                    and used only for verification purposes. Your ID proof is required to activate your business
                    account. Optional documents help build credibility with customers.
                </p>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-amber-100/50 text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Your documents are encrypted and secure</span>
            </div>
        </div>
    )
}

export default Step5Legal
