import { useState } from 'react'
import { Package, Tag, DollarSign, TrendingUp } from 'lucide-react'

interface Step4ProductsProps {
    formData: {
        categories: string[]
        brands: { [key: string]: string }
        priceRanges: { [key: string]: { min: string; max: string } }
        stockLevels: { [key: string]: string }
    }
    updateFormData: (field: string, value: any) => void
}

const Step4Products = ({ formData, updateFormData }: Step4ProductsProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('')

    const productCategories = [
        'Cement & Concrete',
        'Steel & Iron',
        'Bricks & Blocks',
        'Sand & Aggregates',
        'Tiles & Flooring',
        'Paints & Coatings',
        'Plumbing Supplies',
        'Electrical Supplies',
        'Hardware & Tools',
        'Doors & Windows',
        'Roofing Materials',
        'Sanitary Ware'
    ]

    const stockLevelOptions = [
        { value: 'high', label: 'High Stock', color: 'text-green-400' },
        { value: 'medium', label: 'Medium Stock', color: 'text-amber-400' },
        { value: 'low', label: 'Low Stock', color: 'text-orange-400' },
        { value: 'out', label: 'Out of Stock', color: 'text-red-400' }
    ]

    const toggleCategory = (category: string) => {
        const newCategories = formData.categories.includes(category)
            ? formData.categories.filter(c => c !== category)
            : [...formData.categories, category]

        updateFormData('categories', newCategories)

        // If removing category, clean up related data
        if (!newCategories.includes(category)) {
            const newBrands = { ...formData.brands }
            const newPriceRanges = { ...formData.priceRanges }
            const newStockLevels = { ...formData.stockLevels }
            delete newBrands[category]
            delete newPriceRanges[category]
            delete newStockLevels[category]
            updateFormData('brands', newBrands)
            updateFormData('priceRanges', newPriceRanges)
            updateFormData('stockLevels', newStockLevels)
        }
    }

    const updateBrand = (category: string, value: string) => {
        updateFormData('brands', { ...formData.brands, [category]: value })
    }

    const updatePriceRange = (category: string, type: 'min' | 'max', value: string) => {
        const currentRange = formData.priceRanges[category] || { min: '', max: '' }
        updateFormData('priceRanges', {
            ...formData.priceRanges,
            [category]: { ...currentRange, [type]: value }
        })
    }

    const updateStockLevel = (category: string, value: string) => {
        updateFormData('stockLevels', { ...formData.stockLevels, [category]: value })
    }

    return (
        <div className="space-y-6">
            {/* Category Selection */}
            <div>
                <label className="block text-amber-100/80 mb-3 text-sm font-semibold">
                    Product Categories <span className="text-red-400">*</span>
                </label>
                <p className="text-amber-100/60 text-sm mb-4">
                    Select all categories of products you deal with
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {productCategories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => toggleCategory(category)}
                            className={`p-3 rounded-lg border-2 text-left text-sm font-semibold ${formData.categories.includes(category)
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-100'
                                    : 'border-amber-500/20 bg-[#1a120b]/60 text-amber-100/70 hover:border-amber-500/40'
                                }`}
                        >
                            <Package className="w-4 h-4 inline mr-2" />
                            {category}
                        </button>
                    ))}
                </div>
                {formData.categories.length > 0 && (
                    <p className="text-green-400 text-sm mt-3">
                        ✓ {formData.categories.length} {formData.categories.length === 1 ? 'category' : 'categories'} selected
                    </p>
                )}
            </div>

            {/* Category Details */}
            {formData.categories.length > 0 && (
                <div className="bg-[#1a120b]/60 border border-amber-500/30 rounded-lg p-6">
                    <h3 className="text-amber-100 font-bold mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Category Details
                    </h3>

                    {/* Category Selector */}
                    <div className="mb-6">
                        <label className="block text-amber-100/80 mb-2 text-sm font-semibold">
                            Select category to add details
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500/60"
                        >
                            <option value="">Choose a category...</option>
                            {formData.categories.map((category) => (
                                <option key={category} value={category} className="bg-[#1a120b]">
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Details Form for Selected Category */}
                    {selectedCategory && (
                        <div className="space-y-4 p-4 bg-[#2d1a0a]/60 rounded-lg border border-amber-500/20">
                            <h4 className="text-amber-300 font-semibold mb-3">{selectedCategory}</h4>

                            {/* Brand Names */}
                            <div>
                                <label className="block text-amber-100/80 mb-2 text-sm font-semibold">
                                    Brand Names
                                </label>
                                <input
                                    type="text"
                                    value={formData.brands[selectedCategory] || ''}
                                    onChange={(e) => updateBrand(selectedCategory, e.target.value)}
                                    className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg px-4 py-2 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                                    placeholder="e.g., ACC, Ultratech, Ambuja (comma separated)"
                                />
                                <p className="text-amber-100/50 text-xs mt-1">
                                    Enter brand names separated by commas
                                </p>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-amber-100/80 mb-2 text-sm font-semibold">
                                    Price Range
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                                        <span className="absolute left-9 top-1/2 -translate-y-1/2 text-amber-100/60 text-sm">₹</span>
                                        <input
                                            type="number"
                                            value={formData.priceRanges[selectedCategory]?.min || ''}
                                            onChange={(e) => updatePriceRange(selectedCategory, 'min', e.target.value)}
                                            className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-14 pr-3 py-2 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                                            placeholder="Min"
                                            min="0"
                                        />
                                    </div>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                                        <span className="absolute left-9 top-1/2 -translate-y-1/2 text-amber-100/60 text-sm">₹</span>
                                        <input
                                            type="number"
                                            value={formData.priceRanges[selectedCategory]?.max || ''}
                                            onChange={(e) => updatePriceRange(selectedCategory, 'max', e.target.value)}
                                            className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-14 pr-3 py-2 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60"
                                            placeholder="Max"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stock Level */}
                            <div>
                                <label className="block text-amber-100/80 mb-2 text-sm font-semibold">
                                    Stock Availability
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {stockLevelOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => updateStockLevel(selectedCategory, option.value)}
                                            className={`p-2 rounded-lg border text-sm font-semibold ${formData.stockLevels[selectedCategory] === option.value
                                                    ? 'border-amber-500 bg-amber-500/10'
                                                    : 'border-amber-500/20 bg-[#1a120b]/60 hover:border-amber-500/40'
                                                }`}
                                        >
                                            <TrendingUp className={`w-4 h-4 inline mr-1 ${option.color}`} />
                                            <span className="text-amber-100">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary of Completed Categories */}
                    {formData.categories.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-amber-500/20">
                            <p className="text-amber-100/70 text-sm mb-2">
                                <span className="font-semibold">Progress:</span> Details added for{' '}
                                {Object.keys(formData.brands).length} of {formData.categories.length} categories
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {formData.categories.map((cat) => (
                                    <span
                                        key={cat}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${formData.brands[cat] && formData.stockLevels[cat]
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}
                                    >
                                        {cat}
                                        {formData.brands[cat] && formData.stockLevels[cat] && ' ✓'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Info Note */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-100/70 text-sm">
                    <span className="font-semibold text-amber-300">Note:</span> You can add more products and
                    update details later from your dashboard. This information helps customers find the right
                    products and understand your inventory.
                </p>
            </div>
        </div>
    )
}

export default Step4Products
