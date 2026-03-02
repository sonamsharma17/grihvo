import { MapPin, Navigation, Map } from 'lucide-react'

interface Step2LocationProps {
    formData: {
        address: string
        city: string
        pincode: string
        coordinates: { lat: number; lng: number }
        serviceRadius: number
        landmark: string
    }
    updateFormData: (field: string, value: any) => void
}

const Step2Location = ({ formData, updateFormData }: Step2LocationProps) => {
    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    updateFormData('coordinates', {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                    console.log('Location:', position.coords.latitude, position.coords.longitude)
                },
                (error) => {
                    console.error('Error getting location:', error)
                    alert('Unable to get your location. Please enter manually.')
                }
            )
        } else {
            alert('Geolocation is not supported by your browser.')
        }
    }

    return (
        <div className="space-y-6">
            {/* Full Address */}
            <div>
                <label htmlFor="address" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Full Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-amber-400/60" />
                    <textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 resize-none"
                        placeholder="Enter complete business address"
                        rows={3}
                        required
                    />
                </div>
            </div>

            {/* City and Pincode */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* City */}
                <div>
                    <label htmlFor="city" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                        City <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="Enter city name"
                        required
                    />
                </div>

                {/* Pincode */}
                <div>
                    <label htmlFor="pincode" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                        Pincode <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => updateFormData('pincode', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="6-digit pincode"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                    />
                </div>
            </div>

            {/* Landmark (Optional) */}
            <div>
                <label htmlFor="landmark" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Landmark <span className="text-amber-100/40 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                        type="text"
                        id="landmark"
                        value={formData.landmark}
                        onChange={(e) => updateFormData('landmark', e.target.value)}
                        className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                        placeholder="Nearby landmark for easy identification"
                    />
                </div>
            </div>

            {/* Google Maps Placeholder */}
            <div>
                <label className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Location on Map <span className="text-amber-100/40 text-xs">(Pin your exact location)</span>
                </label>
                <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-8">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center">
                            <Map className="w-10 h-10 text-amber-400" />
                        </div>
                        <p className="text-amber-100/70 text-center">
                            Google Maps integration will be added here
                        </p>
                        <button
                            type="button"
                            onClick={handleGetCurrentLocation}
                            className="flex items-center gap-2 px-6 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-100 hover:bg-amber-500/30 font-semibold"
                        >
                            <Navigation className="w-4 h-4" />
                            <span>Use Current Location</span>
                        </button>
                        {formData.coordinates.lat !== 0 && formData.coordinates.lng !== 0 && (
                            <p className="text-green-400 text-sm">
                                Location set: {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Service/Delivery Radius Slider */}
            <div>
                <label htmlFor="serviceRadius" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                    Service/Delivery Radius
                </label>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-amber-100/60 text-sm">How far can you deliver?</span>
                        <span className="text-amber-300 font-bold text-lg">{formData.serviceRadius} km</span>
                    </div>
                    <input
                        type="range"
                        id="serviceRadius"
                        min="1"
                        max="50"
                        step="1"
                        value={formData.serviceRadius}
                        onChange={(e) => updateFormData('serviceRadius', parseInt(e.target.value))}
                        className="w-full h-2 bg-[#1a120b]/60 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(formData.serviceRadius / 50) * 100}%, #2d1a0a ${(formData.serviceRadius / 50) * 100}%, #2d1a0a 100%)`
                        }}
                    />
                    <div className="flex justify-between text-xs text-amber-100/40">
                        <span>1 km</span>
                        <span>25 km</span>
                        <span>50 km</span>
                    </div>
                </div>
            </div>

            {/* Info Note */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-100/70 text-sm">
                    <span className="font-semibold text-amber-300">Note:</span> Your service radius determines
                    how far you can deliver products. Customers within this radius will be able to see and order
                    from your business. You can adjust this later from your dashboard.
                </p>
            </div>

            {/* Custom Slider Styles */}
            <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          cursor: pointer;
          border: 2px solid #1a120b;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          cursor: pointer;
          border: 2px solid #1a120b;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }

        .slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.8);
        }

        .slider::-moz-range-thumb:hover {
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.8);
        }
      `}</style>
        </div>
    )
}

export default Step2Location
