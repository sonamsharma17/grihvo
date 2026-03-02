import { useNavigate } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useTranslation } from 'react-i18next'

const Categories = () => {
  const { t } = useTranslation()
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)
  const navigate = useNavigate()

  const handleCategoryClick = (key: string) => {
    if (key === 'materials') navigate('/products')
    else if (key === 'workers') navigate('/workers')
    else if (key === 'property') navigate('/properties-list')
  }

  const categories = [
    { key: 'workers', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop' },
    { key: 'materials', image: 'material.png' },
    { key: 'design', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop' },
    { key: 'property', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop' },
  ]

  return (
    <section ref={sectionRef} className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#4d3a2a]/40 via-[#5d4a3a]/50 to-transparent -z-10" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-black text-amber-100 mb-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {t('categories.heading')}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600 mx-auto rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {categories.map((category, index) => (
            <div
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
              className={`group relative bg-[#2d1a0a]/60 backdrop-blur-md border border-amber-500/10 rounded-3xl overflow-hidden transition-all duration-700 ease-in-out hover:bg-[#2d1a0a]/80 hover:border-amber-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer flex flex-col sm:flex-row h-[200px] sm:h-[240px] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <div className="flex-1 p-8 flex flex-col justify-center relative z-10">
                <h3 className="text-2xl sm:text-3xl font-black text-amber-100 group-hover:text-amber-400 transition-colors duration-300 leading-tight">
                  {t(`categories.${category.key}`)}
                </h3>
              </div>
              <div className="relative w-full sm:w-1/2 h-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2d1a0a] via-transparent to-transparent z-10 sm:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d1a0a] via-transparent to-transparent z-10 sm:hidden block" />
                <img src={category.image} alt={t(`categories.${category.key}`)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
