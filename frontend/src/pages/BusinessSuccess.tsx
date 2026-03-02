import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, Home, Sparkles } from 'lucide-react'
import { useEffect } from 'react'

const BusinessSuccess = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const businessName = location.state?.businessName || 'Your Business'

    // Redirect if accessed directly without submission
    useEffect(() => {
        if (!location.state?.fromSubmission) {
            navigate('/')
        }
    }, [location.state, navigate])

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
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

            <div className="max-w-2xl w-full text-center">
                {/* Success Icon with Animation */}
                <div className="flex justify-center mb-8 animate-bounce">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-xl opacity-50" />
                        <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 w-32 h-32 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-20 h-20 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <div className="bg-[#2d1a0a]/60 backdrop-blur-md border border-amber-500/20 rounded-2xl p-10 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-amber-400" />
                        <h1 className="text-4xl font-black text-amber-100">
                            Application Submitted{' '}
                            <span className="text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">
                                Successfully!
                            </span>
                        </h1>
                    </div>

                    <p className="text-amber-100/80 text-lg mb-6">
                        Thank you for registering <span className="font-bold text-amber-300">{businessName}</span> with us!
                    </p>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-6">
                        <p className="text-amber-100/90 text-base leading-relaxed">
                            Your application is currently <span className="font-bold text-amber-400">pending review</span>.
                            <br />
                            We will verify and approve your business within{' '}
                            <span className="font-bold text-amber-300">2-3 business days</span>.
                        </p>
                    </div>

                    <p className="text-amber-100/60 text-sm">
                        You will receive a confirmation email once your business has been approved.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105"
                    >
                        <Home className="w-5 h-5" />
                        <span>Back to Home</span>
                    </button>
                </div>

                {/* Help Text */}
                <p className="text-center text-amber-100/50 text-sm mt-8">
                    Have questions?{' '}
                    <a href="#" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                        Contact our support team
                    </a>
                </p>
            </div>
        </div>
    )
}

export default BusinessSuccess
