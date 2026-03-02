const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔥 MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB chal raha hai");
    })
    .catch((err) => {
        console.log("❌ MongoDB error:", err.message);
    });

// Routes
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/super-admin', require('./routes/superAdminRoutes'));
app.use('/api/workers', require('./routes/workerRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));

// Test route
app.get("/", (req, res) => {
    res.send("Backend + MongoDB dono chal rahe hain 🚀");
});

app.listen(5000, () => {
    console.log("Server 5000 port pe chal raha hai");
});
