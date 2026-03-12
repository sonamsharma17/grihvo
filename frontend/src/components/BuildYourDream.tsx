import { Check } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useTranslation } from 'react-i18next'

const BuildYourDream = () => {
  const { t } = useTranslation()
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)

  const features = [
    { titleKey: 'build_dream.feat1_title', descKey: 'build_dream.feat1_desc' },
    { titleKey: 'build_dream.feat2_title', descKey: 'build_dream.feat2_desc' },
    { titleKey: 'build_dream.feat3_title', descKey: 'build_dream.feat3_desc' },
    { titleKey: 'build_dream.feat4_title', descKey: 'build_dream.feat4_desc' },
  ]

  return (
    <section ref={sectionRef} className="py-20 px-4 pt-4 lg:pt-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#4d3a2a]/40 via-[#5d4a3a]/50 to-transparent -z-10" />
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-2xl lg:text-5xl font-black text-amber-100 mb-4 lg:mb-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {t('build_dream.heading')}{' '}
          <span className="text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">
            {t('build_dream.heading_highlight')}
          </span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex gap-4 group transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors duration-300">
                    <Check className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm lg:text-xl font-bold text-amber-100 mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-xs lg:text-base text-amber-100/70 leading-relaxed">{t(feature.descKey)}</p>
                </div>
              </div>
            ))}

            <div className="pt-2 lg:pt-6">
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#1a120b] font-bold px-5 py-2.5 lg:px-8 lg:py-4 text-xs lg:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {t('build_dream.start_btn')}
              </button>
            </div>
          </div>

          <div className={`relative mt-0 lg:-mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-[320px] lg:max-w-none mx-auto">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
                alt="Family watching their dream house"
                loading="lazy"
                className="w-full h-[200px] lg:h-[700px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b]/60 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default BuildYourDream
