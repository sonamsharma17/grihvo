import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const BusinessTypeSelection = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const handleGetStarted = () => {
        navigate('/business/register')
    }

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

            <div className="max-w-4xl w-full text-center">
                {/* Sparkles Icon */}
                <div className="flex justify-center mb-8">
                    <div className="bg-amber-500/20 w-24 h-24 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-amber-400" />
                    </div>
                </div>

                {/* Header */}
                <h1 className="text-6xl font-black text-amber-100 mb-6">
                    {t('business_type.heading')}{' '}
                    <span className="text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">
                        {t('business_type.heading_highlight')}
                    </span>
                </h1>

                <p className="text-amber-100/70 text-xl max-w-2xl mx-auto mb-12">
                    {t('business_type.subheading')}
                </p>

                {/* Get Started Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleGetStarted}
                        className="group relative px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xl rounded-xl flex items-center gap-3 hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105"
                    >
                        <span>{t('business_type.get_started')}</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-16">
                    <p className="text-amber-100/50 text-sm">
                        {t('business_type.need_help')}{' '}
                        <a href="#" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                            {t('business_type.contact_support')}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default BusinessTypeSelection
