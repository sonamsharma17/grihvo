interface PriceDisplayProps {
    actualPrice: number;
    sellingPrice: number;
    discountPercentage?: number;
    size?: 'sm' | 'md' | 'lg';
}

const PriceDisplay = ({ actualPrice, sellingPrice, discountPercentage, size = 'md' }: PriceDisplayProps) => {
    const discount = discountPercentage || Math.round(((actualPrice - sellingPrice) / actualPrice) * 100);

    const sizeClasses = {
        sm: {
            original: 'text-sm',
            selling: 'text-lg',
            badge: 'text-xs px-2 py-0.5'
        },
        md: {
            original: 'text-base',
            selling: 'text-2xl',
            badge: 'text-sm px-2.5 py-0.5'
        },
        lg: {
            original: 'text-lg',
            selling: 'text-3xl',
            badge: 'text-base px-3 py-1'
        }
    };

    const classes = sizeClasses[size];

    return (
        <div className="flex items-center gap-3">
            {/* Original Price (Strikethrough) */}
            <span className={`${classes.original} text-gray-500 line-through`}>
                ₹{actualPrice.toLocaleString('en-IN')}
            </span>

            {/* Arrow */}
            <span className="text-gray-400">→</span>

            {/* Selling Price */}
            <span className={`${classes.selling} font-bold text-green-600`}>
                ₹{sellingPrice.toLocaleString('en-IN')}
            </span>

            {/* Discount Badge */}
            {discount > 0 && (
                <span className={`${classes.badge} bg-orange-100 text-orange-800 font-semibold rounded`}>
                    {discount}% OFF
                </span>
            )}
        </div>
    );
};

export default PriceDisplay;
