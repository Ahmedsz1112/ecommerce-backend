// import express from "express";
// import mongoose from "mongoose";
// import userRouter from "./routers/userRouter";
// import { seedInitialProduts } from "./services/productServices";
// import routerProduct from "./routers/productRouter";
// import routerCart from "./routers/cartRouter";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// const port = process.env.PORT || 8080;

// app.use(express.json());
// app.use(cors());

// mongoose
//   .connect(process.env.MONGO_URL || "")
//   .then(() => console.log("Mongo Connected!"))
//   .catch((error) => console.log("Failed to Connect!", error));

// seedInitialProduts();

// app.use("/user", userRouter);
// app.use("/product", routerProduct);
// app.use("/cart", routerCart);

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter";
import { seedInitialProduts } from "./services/productServices";
import routerProduct from "./routers/productRouter";
import routerCart from "./routers/cartRouter";
import cors from "cors";
import dotenv from "dotenv";

// تحميل متغيرات البيئة
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // تحديد الـ frontend URL
  credentials: true
}));

// Health check endpoint للـ Railway
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    port: port 
  });
});

// دالة الاتصال بـ MongoDB مع معالجة أفضل للأخطاء
async function connectToDatabase() {
  try {
    const mongoUrl = process.env.MONGO_URL || process.env.DATABASE_URL;
    
    if (!mongoUrl) {
      throw new Error("MongoDB URL is not provided in environment variables");
    }

    await mongoose.connect(mongoUrl, {
      // خيارات الاتصال المحدثة
      maxPoolSize: 10, // عدد الاتصالات المتزامنة
      serverSelectionTimeoutMS: 5000, // مهلة الاتصال
      socketTimeoutMS: 45000, // مهلة العمليات
      bufferCommands: false, // تعطيل buffering في حالة عدم الاتصال
      bufferMaxEntries: 0
    });

    console.log("✅ MongoDB Connected Successfully!");
    
    // تشغيل seed بعد الاتصال الناجح
    await seedInitialProduts();
    console.log("✅ Initial products seeded!");
    
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    // إنهاء التطبيق في حالة فشل الاتصال
    process.exit(1);
  }
}

// معالجة أخطاء MongoDB
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB Error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB Reconnected');
});

// Routes
app.use("/user", userRouter);
app.use("/product", routerProduct);
app.use("/cart", routerCart);

// Catch-all route للـ 404
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    availableRoutes: ["/user", "/product", "/cart", "/health"]
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Server Error:", error);
  res.status(500).json({ 
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('⚠️ Shutting down gracefully...');
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('⚠️ SIGTERM received, shutting down...');
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// بدء الخادم
async function startServer() {
  try {
    // الاتصال بقاعدة البيانات أولاً
    await connectToDatabase();
    
    // بدء الخادم
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// تشغيل الخادم
startServer();