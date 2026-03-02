import { useTranslation } from 'react-i18next'

const OurMission = () => {
  const { t } = useTranslation()

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 pointer-events-none -z-10" style={{ backgroundImage: `linear-gradient(rgba(251, 191, 36, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.07) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
      <div className="absolute inset-0 -z-10" style={{ background: `radial-gradient(circle at center, rgba(120, 66, 18, 0.4) 0%, #1a120b 85%)` }} />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black text-amber-100 mb-8">
            {t('mission.heading')}{' '}
            <span className="text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">
              {t('mission.heading_highlight')}
            </span>
          </h2>
          <div className="space-y-6 text-amber-100/80 text-lg lg:text-xl leading-relaxed">
            <p>{t('mission.para1')}</p>
            <p>{t('mission.para2')}</p>
            <p>{t('mission.para3')}</p>
            <p className="text-amber-100/90 font-semibold">{t('mission.para4')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#1a120b] font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              {t('mission.join_business')}
            </button>
            <button className="bg-transparent border-2 border-amber-500/60 hover:border-amber-500 text-amber-100 font-bold px-10 py-4 rounded-full hover:bg-amber-500/10 transition-all duration-300 hover:scale-105">
              {t('mission.join_individual')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurMission
