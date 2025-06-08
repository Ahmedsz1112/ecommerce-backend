// import express from "express";
// import mongoose from "mongoose";
// import userRouter from "./routers/userRouter";
// import { seedInitialProduts } from "./services/productServices";
// import routerProduct from "./routers/productRouter";
// import routerCart from "./routers/cartRouter";
// import cors from "cors";
// require("dotenv").config();

// const app = express();
// const port = 8080;

// app.use(express.json());
// app.use(cors());

// mongoose
//   .connect(process.env.DATABASE_URL || '')
//   .then(() => console.log("Mongo Connected!"))
//   .catch((error) => console.log("Failed to Connect!", error));

// seedInitialProduts();

// app.use("/user", userRouter);
// app.use("/product", routerProduct);
// app.use("/cart", routerCart);

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });


"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const productServices_1 = require("./services/productServices");
const productRouter_1 = __importDefault(require("./routers/productRouter"));
const cartRouter_1 = __importDefault(require("./routers/cartRouter"));
const cors_1 = __importDefault(require("cors"));

require("dotenv").config();

const app = (0, express_1.default)();
const port = process.env.PORT || 3002;

// التحقق من متغيرات البيئة المطلوبة
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error('DATABASE_URL is not defined in environment variables');
    process.exit(1);
}

// Middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// اتصال قاعدة البيانات
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(DATABASE_URL);
        console.log("✅ MongoDB Connected Successfully!");
        
        // تشغيل seed للمنتجات بعد الاتصال بقاعدة البيانات
        await (0, productServices_1.seedInitialProducts)();
        console.log("✅ Initial products seeded!");
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};

// Routes
app.use("/api/user", userRouter_1.default);
app.use("/api/product", productRouter_1.default);
app.use("/api/cart", cartRouter_1.default);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});

// تشغيل الخادم
const startServer = async () => {
    await connectDB();
    
    app.listen(port, () => {
        console.log(`🚀 Server is running at http://localhost:${port}`);
        console.log(`📊 Health check available at http://localhost:${port}/health`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
};

// معالجة إغلاق التطبيق بشكل صحيح
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await mongoose_1.default.connection.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await mongoose_1.default.connection.close();
    process.exit(0);
});

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});