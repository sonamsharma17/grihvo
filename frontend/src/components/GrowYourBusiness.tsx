import { Check } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useTranslation } from 'react-i18next'

const GrowYourBusiness = () => {
  const { t } = useTranslation()
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)

  const benefits = ['grow_business.benefit1', 'grow_business.benefit2', 'grow_business.benefit3']

  return (
    <section ref={sectionRef} className="py-20 px-4 relative">
      <div className="absolute inset-0 pointer-events-none -z-10" style={{ backgroundImage: `linear-gradient(rgba(251, 191, 36, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.07) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
      <div className="absolute inset-0 -z-10" style={{ background: `radial-gradient(circle at center, rgba(120, 66, 18, 0.4) 0%, #1a120b 85%)` }} />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side */}
          <div>
            <h2 className={`text-4xl lg:text-5xl font-black text-amber-100 mt-8 mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              {t('grow_business.heading')}{' '}
              <span className="text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">
                {t('grow_business.heading_highlight')}
              </span>
            </h2>

            <div className="space-y-10">
              {benefits.map((key, index) => (
                <div key={index} className={`flex gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: `${index * 100 + 200}ms` }}>
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-amber-500" />
                    </div>
                  </div>
                  <p className="text-amber-100/70 text-xl leading-loose">{t(key)}</p>
                </div>
              ))}
            </div>

            <div className="pt-16 border-t border-amber-500/20 mt-8">
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#1a120b] font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {t('grow_business.register_btn')}
              </button>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-[#2d1a0a]/40 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-amber-100 mb-6">{t('grow_business.form_heading')}</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-amber-100/80 mb-2 text-sm font-semibold">{t('grow_business.name_label')}</label>
                <input type="text" id="name" className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 transition-colors" placeholder={t('grow_business.name_placeholder')} />
              </div>
              <div>
                <label htmlFor="business" className="block text-amber-100/80 mb-2 text-sm font-semibold">{t('grow_business.business_label')}</label>
                <input type="text" id="business" className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 transition-colors" placeholder={t('grow_business.business_placeholder')} />
              </div>
              <div>
                <label htmlFor="address" className="block text-amber-100/80 mb-2 text-sm font-semibold">{t('grow_business.address_label')}</label>
                <input type="text" id="address" className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 transition-colors" placeholder={t('grow_business.address_placeholder')} />
              </div>
              <div>
                <label htmlFor="products" className="block text-amber-100/80 mb-2 text-sm font-semibold">{t('grow_business.products_label')}</label>
                <input type="text" id="products" className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 transition-colors" placeholder={t('grow_business.products_placeholder')} />
              </div>
              <div>
                <label htmlFor="contact" className="block text-amber-100/80 mb-2 text-sm font-semibold">{t('grow_business.contact_label')}</label>
                <input type="tel" id="contact" className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 transition-colors" placeholder={t('grow_business.contact_placeholder')} />
              </div>
              <div>
                <label htmlFor="comment" className="block text-amber-100/80 mb-2 text-sm font-semibold">{t('grow_business.comment_label')}</label>
                <textarea id="comment" rows={4} className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 transition-colors resize-none" placeholder={t('grow_business.comment_placeholder')} />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#1a120b] font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {t('grow_business.submit_btn')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GrowYourBusiness
