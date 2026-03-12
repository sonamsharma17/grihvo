import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useTranslation } from 'react-i18next'

const SkilledProfessionals = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const professionals = [
    { name: 'Plumber', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400' },
    { name: 'Electrician', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400' },
    { name: 'Carpenter', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400' },
    { name: 'Painter', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400' },
    { name: 'Pop Designer', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=400' },
    { name: 'Mason', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400' },
    { name: 'House Help', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400' },
    { name: 'Cleaner', image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=400' },
    { name: 'Welder', image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&q=80&w=400' },
    { name: 'Tile Installer', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        if (next >= professionals.length) return 0
        return next
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [professionals.length])

  const handleNext = () => setCurrentIndex((prev) => (prev + 1 >= professionals.length ? 0 : prev + 1))
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 < 0 ? professionals.length - 1 : prev - 1))

  return (
    <section
      ref={sectionRef}
      className={`py-20 px-4 pt-6 lg:pt-20 relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="absolute inset-0 pointer-events-none -z-10" style={{ backgroundImage: `linear-gradient(rgba(251, 191, 36, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.07) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
      <div className="absolute inset-0 -z-10" style={{ background: `radial-gradient(circle at center, rgba(120, 66, 18, 0.4) 0%, #1a120b 85%)` }} />

      <div className="max-w-7xl mx-auto">
        <div className="mb-4 lg:mb-12 text-center">
          <h2 className="text-2xl lg:text-5xl font-black text-amber-100 mb-2 whitespace-nowrap">{t('skilled.heading')}</h2>
          <p className="text-amber-100/70 text-xs lg:text-lg">{t('skilled.subheading')}</p>
        </div>

        <div className="relative group overflow-hidden">
          <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-amber-500/90 hover:bg-amber-500 text-[#1a120b] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100" aria-label="Previous"><ChevronLeft className="w-6 h-6" /></button>
          <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-amber-500/90 hover:bg-amber-500 text-[#1a120b] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100" aria-label="Next"><ChevronRight className="w-6 h-6" /></button>

          <div className="overflow-hidden">
            <div className="flex gap-6 transition-transform duration-700 ease-in-out" style={{ transform: isMobile ? `translateX(-${currentIndex * 184}px)` : `translateX(-${currentIndex * 25.4}%)` }}>
              {[...professionals, ...professionals].map((professional, index) => (
                <div
                  key={`${professional.name}-${index}`}
                  className="flex-shrink-0 cursor-pointer"
                  style={{ width: isMobile ? '160px' : 'calc(25% - 18px)' }}
                  onClick={() => navigate(`/workers?query=${encodeURIComponent(professional.name)}`)}
                >
                  <div className="relative bg-[#2d1a0a]/40 backdrop-blur-md border border-amber-500/20 rounded-2xl overflow-hidden">
                    <div className="relative h-80 overflow-hidden">
                      <img src={professional.image} alt={professional.name} loading="lazy" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b] via-[#1a120b]/50 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xs lg:text-2xl font-bold text-transparent bg-gradient-to-br from-amber-200 to-amber-400 bg-clip-text mb-2">{professional.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {[0, 1, 2].map((dotIndex) => (
            <button key={dotIndex} onClick={() => setCurrentIndex(dotIndex)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${Math.floor(currentIndex / 3) === dotIndex ? 'bg-amber-500 w-8' : 'bg-amber-500/30 hover:bg-amber-500/50'}`} aria-label={`Go to slide ${dotIndex + 1}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkilledProfessionals
