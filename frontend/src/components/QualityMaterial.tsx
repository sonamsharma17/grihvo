import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useTranslation } from 'react-i18next'

const QualityMaterial = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [materials, setMaterials] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const { ref: sectionRef } = useScrollAnimation(0.1)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products?limit=50')
        const data = await response.json()
        if (data.success) {
          // Group by business and take the first product of each
          const businessMap = new Map()
          data.products.forEach((p: any) => {
            if (!businessMap.has(p.businessId._id)) {
              businessMap.set(p.businessId._id, {
                id: p._id,
                name: p.productName,
                image: p.images[0]?.startsWith('http') ? p.images[0] : `http://localhost:5000/${p.images[0]}`,
                category: p.category
              })
            }
          })

          const uniqueProducts = Array.from(businessMap.values()).slice(0, 12)
          setMaterials(uniqueProducts)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchProducts()
  }, [])
  // ... existing auto-slide logic ...
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        if (next >= materials.length) {
          return 0
        }
        return next
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [materials.length])

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const next = prev + 1
      if (next >= materials.length) return 0
      return next
    })
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const previous = prev - 1
      if (previous < 0) return materials.length - 1
      return previous
    })
  }

  return (
    <section ref={sectionRef} className="py-20 px-4 relative">
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

      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-amber-100 mb-2">
            {t('quality.heading')}
          </h2>
          <p className="text-amber-100/70 text-lg">
            {t('quality.subheading')}
          </p>
        </div>

        <div className="relative group overflow-hidden">
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-amber-500/90 hover:bg-amber-500 text-[#1a120b] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-amber-500/90 hover:bg-amber-500 text-[#1a120b] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 25.4}%)`
              }}
            >
              {[...materials, ...materials].map((material, index) => (
                <div
                  key={`${material.id}-${index}`}
                  className="flex-shrink-0 cursor-pointer"
                  style={{ width: 'calc(25% - 18px)' }}
                  onClick={() => navigate(`/products?productId=${material.id}`)}
                >
                  <div className="relative bg-[#2d1a0a]/40 backdrop-blur-md border border-amber-500/20 rounded-2xl overflow-hidden">
                    {/* Image */}
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={material.image}
                        alt={material.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b] via-[#1a120b]/50 to-transparent" />
                    </div>

                    {/* Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-transparent bg-gradient-to-br from-amber-200 to-amber-400 bg-clip-text mb-2">
                        {material.name}
                      </h3>
                      <div className="inline-flex items-center text-amber-400/60 hover:text-amber-400/80 hover:translate-x-1.5 transition-all duration-100">
                        <span className="text-sm font-semibold mr-1">{t('quality.view_cta')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {[0, 1, 2].map((dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setCurrentIndex(dotIndex)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${Math.floor(currentIndex / 3) === dotIndex
                ? 'bg-amber-500 w-8'
                : 'bg-amber-500/30 hover:bg-amber-500/50'
                }`}
              aria-label={`Go to slide ${dotIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default QualityMaterial
