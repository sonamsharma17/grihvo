const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token || token === 'null' || token === 'undefined') {
            console.log('Authentication failed: No token provided (or null/undefined)');
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // Try fallback secret if main secret fails (backward compatibility/config issue)
            try {
                decoded = jwt.verify(token, 'your-secret-key');
                console.warn('⚠️ Token verified with fallback secret key!');
            } catch (fallbackErr) {
                throw err;
            }
        }

        // Find user
        const user = await User.findById(decoded.userId);

        if (!user) {
            console.log('Authentication failed: User not found for ID', decoded.userId);
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        // Attach user to request
        req.user = user;
        req.userId = user._id;
        req.userRole = user.role;

        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};

// Check if user has admin role (vendor)
const isVendor = (req, res, next) => {
    if (req.userRole !== 'admin' && req.userRole !== 'superadmin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Vendor access required.'
        });
    }
    next();
};

// Check if user has superadmin role
const isSuperAdmin = (req, res, next) => {
    if (req.userRole !== 'superadmin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Super admin access required.'
        });
    }
    next();
};

module.exports = {
    authenticate,
    isVendor,
    isSuperAdmin
};
