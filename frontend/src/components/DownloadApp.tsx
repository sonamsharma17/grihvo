import { Smartphone } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useTranslation } from 'react-i18next'

const DownloadApp = () => {
  const { t } = useTranslation()
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)

  return (
    <section ref={sectionRef} className="py-6 lg:py-20 px-4 relative">
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
        style={{ background: `radial-gradient(circle at center, rgba(120, 66, 18, 0.4) 0%, #1a120b 85%)` }}
      />

      <div className="max-w-4xl mx-auto text-center">
        {/* Icon */}
        <div className={`mb-4 lg:mb-8 flex justify-center transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="w-12 h-12 lg:w-20 lg:h-20 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-center">
            <Smartphone className="w-6 h-6 lg:w-10 lg:h-10 text-amber-400" />
          </div>
        </div>

        <h2 className={`text-2xl lg:text-5xl font-black text-amber-100 mb-2 lg:mb-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {t('download.heading')}{' '}
          <span className="text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">
            {t('download.heading_highlight')}
          </span>
        </h2>
        <p className={`text-amber-100/70 text-xs lg:text-lg mb-4 lg:mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {t('download.subtitle')}
        </p>

        <div className={`inline-block bg-[#2d1a0a]/40 backdrop-blur-md border border-amber-500/30 rounded-full px-4 py-2 lg:px-8 lg:py-4 mb-4 lg:mb-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-amber-400 font-bold text-xs lg:text-base">{t('download.badge')}</p>
        </div>

        <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#1a120b] font-bold px-5 py-2 lg:px-10 lg:py-4 text-xs lg:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            {t('download.notify_btn')}
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-3 lg:gap-6 mt-6 lg:mt-16">
          {(['feat1', 'feat2', 'feat3'] as const).map((feat) => (
              <div key={feat} className="bg-[#2d1a0a]/40 backdrop-blur-md border border-amber-500/20 rounded-xl p-3 lg:p-6">
              <h4 className="text-amber-100 font-bold text-xs lg:text-base mb-1 lg:mb-2">{t(`download.${feat}_title`)}</h4>
              <p className="hidden lg:block text-amber-100/60 text-sm">{t(`download.${feat}_desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DownloadApp
