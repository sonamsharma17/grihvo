import { useNavigate } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useTranslation } from 'react-i18next'

const ProfessionalRegistration = () => {
  const { t } = useTranslation()
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)
  const navigate = useNavigate()

  const categories = [
    { titleKey: 'professional_reg.labour_title', descKey: 'professional_reg.labour_desc', type: 'Labour' },
    { titleKey: 'professional_reg.househelp_title', descKey: 'professional_reg.househelp_desc', type: 'HouseHelp' },
    { titleKey: 'professional_reg.professional_title', descKey: 'professional_reg.professional_desc', type: 'Professional' },
  ]

  const handleRegisterClick = (type: string) => {
    if (type === 'Labour') navigate('/work/register?type=Labour')
    else if (type === 'Professional') navigate('/work/register?type=Professional')
    else navigate('/work/register')
  }

  return (
    <section ref={sectionRef} className="py-6 md:py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#4d3a2a]/40 via-[#5d4a3a]/50 to-transparent -z-10" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-12 text-center">
          <h2 className={`text-2xl md:text-5xl font-black text-amber-100 mb-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {t('professional_reg.heading')}{' '}
            <span className="text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">
              {t('professional_reg.heading_highlight')}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[320px] md:max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleRegisterClick(category.type)}
              className={`group bg-[#2d1a0a]/40 backdrop-blur-md border border-amber-500/20 rounded-2xl p-4 py-8 md:p-8 md:py-16 hover:bg-[#2d1a0a]/50 hover:border-amber-500/35 transition-all duration-500 hover:shadow-[0_8px_20px_rgba(245,158,11,0.1)] cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <h3 className="text-base md:text-2xl font-bold text-transparent bg-gradient-to-br from-amber-200 to-amber-400 bg-clip-text mb-2 md:mb-3">
                {t(category.titleKey)}
              </h3>
              <p className="text-amber-100/70 text-xs md:text-base mb-3 md:mb-6 leading-relaxed">{t(category.descKey)}</p>
              <div className="inline-flex items-center text-amber-400/60 group-hover:text-amber-400/80 transition-colors duration-100 hover:translate-x-1.5 transition-transform duration-100">
                <span className="text-sm font-semibold mr-1">{t('professional_reg.register_now')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProfessionalRegistration
