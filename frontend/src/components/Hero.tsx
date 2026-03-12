import { useState, useEffect } from 'react'
import { Wrench, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Hero = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentService, setCurrentService] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [locations, setLocations] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [searchService, setSearchService] = useState('')
  const [services, setServices] = useState(['Electrician', 'Plumber', 'Carpenter', 'Painter', 'White Washer'])

  const handleSearch = () => {
    let url = '/workers?'
    if (selectedLocation) url += `location=${encodeURIComponent(selectedLocation)}&`
    if (searchService) url += `query=${encodeURIComponent(searchService)}`
    navigate(url)
  }

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('https://grihvo-backend.onrender.com/api/workers/locations')
        const data = await response.json()
        if (data.success) setLocations(data.locations)
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }
    fetchLocations()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let url = 'https://grihvo-backend.onrender.com/api/workers/categories'
        if (selectedLocation) url += `?location=${encodeURIComponent(selectedLocation)}`
        const response = await fetch(url)
        const data = await response.json()
        if (data.success) {
          setAvailableCategories(data.categories)
          if (data.categories.length > 0) {
            setServices([...data.categories.slice(0, 5), 'Labour'])
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [selectedLocation])

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0)
      setTimeout(() => {
        setCurrentService((prev) => (prev + 1) % services.length)
        setOpacity(1)
      }, 500)
    }, 3000)
    return () => clearInterval(interval)
  }, [services])

  useEffect(() => {
    setTimeout(() => setImagesLoaded(true), 100)
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-24">
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <div className="space-y-4 md:max-w-[680px] md:mx-auto lg:max-w-none lg:mx-0">
              <h1 className="text-5xl lg:text-6xl font-black leading-tight text-left md:text-center lg:text-left">
                <span className="text-amber-100">{t('hero.headline_pre')} </span>
                <span
                  className="text-transparent bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text transition-all duration-500"
                  style={{ opacity }}
                >
                  {services[currentService]}
                </span>
                <br />
                <span className="text-amber-100">{t('hero.headline_mid')} </span>
                <span className="text-transparent bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text">{t('hero.home')}</span>
                <span className="text-amber-100"> {t('hero.and')} </span>
                <span className="text-transparent bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text">{t('hero.projects')}</span>
                <span className="text-amber-100">.</span>
              </h1>
              <p className="text-amber-100/70 text-lg text-left md:text-center lg:text-left">{t('hero.subtitle')}</p>
            </div>

            {/* Search Inputs */}
            <div className="space-y-4">
              <div className="relative group md:max-w-[680px] md:mx-auto lg:max-w-none lg:mx-0">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  list="worker-locations"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  placeholder={t('hero.location_placeholder')}
                  className="w-full pl-14 pr-4 py-4 bg-[#2d1a0a]/60 backdrop-blur-md border border-amber-500/30 rounded-2xl text-amber-100 placeholder:text-amber-100/40 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
                <datalist id="worker-locations">
                  {locations.map((loc, idx) => <option key={idx} value={loc} />)}
                </datalist>
              </div>
              <div className="relative group md:max-w-[680px] md:mx-auto lg:max-w-none lg:mx-0">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400">
                  <Wrench className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  list="worker-categories"
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  placeholder={t('hero.service_placeholder')}
                  className="w-full pl-14 pr-4 py-4 bg-[#2d1a0a]/60 backdrop-blur-md border border-amber-500/30 rounded-2xl text-amber-100 placeholder:text-amber-100/40 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
                <datalist id="worker-categories">
                  {availableCategories.map((cat, idx) => <option key={idx} value={cat} />)}
                  <option value="Labour" />
                </datalist>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2 md:max-w-[680px] md:mx-auto lg:max-w-none lg:mx-0">
                <button
                  onClick={handleSearch}
                  className="flex-1 px-8 py-4 bg-amber-500 text-[#1a120b] rounded-full font-bold text-lg transition-all hover:shadow-[0_8px_30px_rgba(245,158,11,0.5)] shadow-[0_6px_20px_0_rgba(245,158,11,0.4)]"
                >
                  {t('hero.search_btn')}
                </button>
                <button className="flex-1 px-8 py-4 border-2 border-amber-500/40 text-amber-200 rounded-full font-bold text-lg transition-all hover:bg-amber-500/10 hover:border-amber-500/60">
                  {t('hero.post_project_btn')}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Image Grid */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[550px]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-3xl blur-3xl -z-10"></div>
              <div className="relative grid grid-cols-2 gap-4 p-4 bg-[#2d1a0a]/40 backdrop-blur-sm border border-amber-500/20 rounded-3xl">
                <div className={`fade-in ${imagesLoaded ? 'loaded' : ''} overflow-hidden rounded-2xl border border-amber-500/30`}>
                  <img src="https://t4.ftcdn.net/jpg/02/20/20/41/360_F_220204174_vfgB0Vo2i4MZ8Sv5hmtsx5IwcvrDCZox.jpg" alt="Plumber" loading="lazy" className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-500" />
                </div>
                <div className={`fade-in ${imagesLoaded ? 'loaded' : ''} overflow-hidden rounded-2xl border border-amber-500/30`} style={{ transitionDelay: '150ms' }}>
                  <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=500" alt="Electrician" loading="lazy" className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-500" />
                </div>
                <div className={`fade-in ${imagesLoaded ? 'loaded' : ''} overflow-hidden rounded-2xl border border-amber-500/30`} style={{ transitionDelay: '300ms' }}>
                  <img src="https://studyhub.org.uk/wp-content/uploads/2023/11/handsome-carpenter-working-with-wood-1-scaled.jpg" alt="Carpenter" loading="lazy" className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-500" />
                </div>
                <div className={`fade-in ${imagesLoaded ? 'loaded' : ''} overflow-hidden rounded-2xl border border-amber-500/30`} style={{ transitionDelay: '450ms' }}>
                  <img src="painter.png" alt="Painter" loading="lazy" className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

export default Hero
