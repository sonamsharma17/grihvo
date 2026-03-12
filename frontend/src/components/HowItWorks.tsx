import { Search, FileText, Shield, CheckCircle } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useTranslation } from 'react-i18next'

const HowItWorks = () => {
  const { t } = useTranslation()
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)

  const steps = [
    { icon: Search, titleKey: 'how_it_works.step1_title', descKey: 'how_it_works.step1_desc' },
    { icon: FileText, titleKey: 'how_it_works.step2_title', descKey: 'how_it_works.step2_desc' },
    { icon: Shield, titleKey: 'how_it_works.step3_title', descKey: 'how_it_works.step3_desc' },
    { icon: CheckCircle, titleKey: 'how_it_works.step4_title', descKey: 'how_it_works.step4_desc' },
  ]

  return (
    <section ref={sectionRef} className="py-20 px-4 pt-6 md:pt-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#4d3a2a]/40 via-[#5d4a3a]/50 to-transparent -z-10" />
      <div className="max-w-7xl mx-auto">
        <div className={`mb-4 md:mb-16 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-amber-100 mb-2 md:mb-4 whitespace-nowrap">
            {t('how_it_works.heading')}{' '}
            <span className="text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">
              {t('how_it_works.heading_highlight')}
            </span>
          </h2>
          <p className="text-amber-100/70 text-xs md:text-sm lg:text-lg max-w-2xl mx-auto">{t('how_it_works.subheading')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-xs mx-auto md:max-w-none">
          {steps.map((step, index) => {
            const Icon = step.icon
            const orderClass = index === 2 ? 'order-4 md:order-3' : index === 3 ? 'order-3 md:order-4' : ''
            return (
              <div key={index} className={`relative ${orderClass}`}>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-amber-500/40 to-amber-500/20 z-0" />
                )}
                <div className={`relative bg-[#2d1a0a]/40 backdrop-blur-md border border-amber-500/20 rounded-2xl p-3 md:p-6 hover:border-amber-500/35 transition-all duration-500 h-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 100 + 200}ms` }}>
                  <div className="absolute -top-3 -left-3 w-6 h-6 md:w-10 md:h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-[#1a120b] font-black text-xs md:text-sm lg:text-lg shadow-lg">{index + 1}</div>
                  <div className="mb-2 md:mb-4 flex justify-center">
                    <div className="w-8 h-8 md:w-16 md:h-16 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 md:w-8 md:h-8 text-amber-400" />
                    </div>
                  </div>
                  <h3 className="text-xs md:text-base lg:text-xl font-bold text-amber-100 mb-1 md:mb-3 text-center h-10 md:h-auto">{t(step.titleKey)}</h3>
                  <p className="text-amber-100/70 text-[10px] md:text-[11px] lg:text-sm leading-relaxed text-center hidden md:block">{t(step.descKey)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
