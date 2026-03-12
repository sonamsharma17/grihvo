import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import Step1BasicDetails from '../components/business/Step1BasicDetails'
import Step2Location from '../components/business/Step2Location'
import Step3Capacity from '../components/business/Step3Capacity'
import Step4Products from '../components/business/Step4Products'
import Step5Legal from '../components/business/Step5Legal'
import Step6WorkingHours from '../components/business/Step6WorkingHours'
import Step7Payment from '../components/business/Step7Payment'
import ReviewSubmit from '../components/business/ReviewSubmit'
import { registerBusiness } from '../api/businessService'
import { useTranslation } from 'react-i18next'

const BusinessRegistration = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const businessType = searchParams.get('type') || 'shop'
    const { t } = useTranslation()

    // Form state management
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        // Step 1: Basic Details
        businessName: '',
        ownerName: '',
        mobile: '',
        email: '',
        businessCategory: '',
        password: '',
        confirmPassword: '',

        // Step 2: Location
        address: '',
        city: '',
        pincode: '',
        coordinates: { lat: 0, lng: 0 },
        serviceRadius: 5,
        landmark: '',

        // Step 3: Capacity
        serviceType: '',
        dailyCapacity: '',
        minOrderValue: '',
        deliveryAvailable: false,
        deliveryCharge: '',

        // Step 4: Products
        categories: [],
        brands: {},
        priceRanges: {},
        stockLevels: {},

        // Step 5: Legal
        gstNumber: '',
        shopLicense: '',
        panCard: '',
        idProof: null,

        // Step 6: Working Hours
        workingDays: [],
        openTime: '',
        closeTime: '',
        emergencyOrders: false,

        // Step 7: Payment
        accountNumber: '',
        ifsc: '',
        accountHolder: '',
        payoutCycle: 'weekly'
    })

    const totalSteps = 8
    const steps = [
        { number: 1, title: t('business_reg.steps.basic_details_title'), description: t('business_reg.steps.basic_details_desc') },
        { number: 2, title: t('business_reg.steps.location_title'), description: t('business_reg.steps.location_desc') },
        { number: 3, title: t('business_reg.steps.capacity_title'), description: t('business_reg.steps.capacity_desc') },
        { number: 4, title: t('business_reg.steps.products_title'), description: t('business_reg.steps.products_desc') },
        { number: 5, title: t('business_reg.steps.legal_title'), description: t('business_reg.steps.legal_desc') },
        { number: 6, title: t('business_reg.steps.working_hours_title'), description: t('business_reg.steps.working_hours_desc') },
        { number: 7, title: t('business_reg.steps.payment_title'), description: t('business_reg.steps.payment_desc') },
        { number: 8, title: t('business_reg.steps.review_title'), description: t('business_reg.steps.review_desc') }
    ]

    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo({ top: 387, behavior: 'smooth' })
    }, [currentStep])

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleEdit = (step: number) => {
        setCurrentStep(step)
        window.scrollTo({ top: 387, behavior: 'smooth' })
    }

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setSubmitError(null)

        try {
            const response = await registerBusiness(formData)

            if (response.success) {
                // Navigate to success page with business name
                navigate('/business/success', {
                    state: {
                        fromSubmission: true,
                        businessName: formData.businessName
                    }
                })
            } else {
                setSubmitError(response.message || 'Failed to submit registration')
            }
        } catch (error: any) {
            console.error('Registration error:', error)
            setSubmitError(error.message || 'An error occurred while submitting your registration')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex items-start justify-center px-4 pt-16 pb-6 lg:min-h-screen lg:items-center lg:py-20">
            {/* Grid Background */}
            <div
                className="absolute inset-0 pointer-events-none -z-10"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.07) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Radial Gradient */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background: `radial-gradient(
            circle at center, 
            rgba(120, 66, 18, 0.4) 0%, 
            #1a120b 85%
          )`
                }}
            />

            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-4 lg:mb-8">
                    <button
                        onClick={() => navigate('/business/type-selection')}
                        className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-semibold">{t('business_reg.back_btn')}</span>
                    </button>
                    <h1 className="text-2xl lg:text-4xl font-black text-amber-100 mb-1 lg:mb-2">
                        {t('business_reg.heading')}{' '}
                        <span className="text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">
                            {t('business_reg.heading_highlight')}
                        </span>
                    </h1>
                    <p className="text-amber-100/70">
                        {t('business_reg.subheading', { type: businessType })}
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-4 lg:mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-amber-100/80 text-sm font-semibold">
                            {t('business_reg.step_prefix')} {currentStep} {t('business_reg.of')} {totalSteps}
                        </span>
                        <span className="text-amber-100/60 text-sm">
                            {Math.round((currentStep / totalSteps) * 100)}% {t('business_reg.complete')}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#2d1a0a]/60 rounded-full h-2 mb-6">
                        <div
                            className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>

                    {/* Step Indicators */}
                    <div className="grid grid-cols-7 gap-2">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className={`flex flex-col items-center ${step.number === currentStep
                                    ? 'opacity-100'
                                    : step.number < currentStep
                                        ? 'opacity-70'
                                        : 'opacity-40'
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.number < currentStep
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                                        : step.number === currentStep
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 ring-4 ring-amber-500/20'
                                            : 'bg-[#2d1a0a]/60 border border-amber-500/20'
                                        }`}
                                >
                                    {step.number < currentStep ? (
                                        <Check className="w-5 h-5 text-white" />
                                    ) : (
                                        <span className="text-sm font-bold text-amber-100">
                                            {step.number}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-amber-100/70 text-center hidden md:block">
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-[#2d1a0a]/60 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 mb-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-amber-100 mb-2">
                            {steps[currentStep - 1].title}
                        </h2>
                        <p className="text-amber-100/60">
                            {steps[currentStep - 1].description}
                        </p>
                    </div>

                    {/* Step Content */}
                    <div>
                        {currentStep === 1 && (
                            <Step1BasicDetails
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                        )}
                        {currentStep === 2 && (
                            <Step2Location
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                        )}
                        {currentStep === 3 && (
                            <Step3Capacity
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                        )}
                        {currentStep === 4 && (
                            <Step4Products
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                        )}
                        {currentStep === 5 && (
                            <Step5Legal
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                        )}
                        {currentStep === 6 && (
                            <Step6WorkingHours
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                        )}
                        {currentStep === 7 && (
                            <Step7Payment
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                        )}
                        {currentStep === 8 && (
                            <ReviewSubmit
                                formData={formData}
                                onEdit={handleEdit}
                                onSubmit={handleSubmit}
                            />
                        )}
                        {currentStep > 8 && (
                            <div className="min-h-[300px] flex items-center justify-center">
                                <p className="text-amber-100/70">{t('business_reg.step_prefix')} {currentStep} - {t('business_reg.coming_soon')}</p>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {submitError && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-400 text-sm">{submitError}</p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-amber-500/20">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 1 || isSubmitting}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm lg:text-base ${currentStep === 1 || isSubmitting
                                ? 'bg-[#1a120b]/60 text-amber-100/40 cursor-not-allowed'
                                : 'bg-[#1a120b]/60 text-amber-100 hover:bg-[#1a120b]/80 border border-amber-500/30'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>{t('business_reg.nav_prev')}</span>
                        </button>

                        {currentStep < totalSteps ? (
                            <button
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm lg:text-base bg-gradient-to-r from-amber-500 to-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{t('business_reg.nav_next')}</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm lg:text-base bg-gradient-to-r from-amber-500 to-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>{t('business_reg.submitting')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>{t('business_reg.submit_btn')}</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Help Text */}
                <p className="text-center text-amber-100/50 text-sm">
                    {t('business_reg.need_help')}{' '}
                    <a href="#" className="text-amber-400 hover:text-amber-300 font-semibold">
                        {t('business_reg.contact_support')}
                    </a>
                </p>
            </div>
        </div>
    )
}

export default BusinessRegistration
