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
const isProduction = process.env.NODE_ENV === 'production';

// إعداد CORS
app.use(cors({
  origin: isProduction 
    ? [process.env.FRONTEND_URL || "*"] 
    : ["http://localhost:3000", "http://localhost:5173"], // للتطوير المحلي
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "E-commerce API is running!",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// دالة الاتصال بـ MongoDB
async function connectToMongoDB() {
  try {
    const mongoUrl = process.env.MONGO_URL;
    
    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    console.log(`🔄 Connecting to MongoDB...`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // خيارات مختلفة للـ production والتطوير
    const connectionOptions = {
      maxPoolSize: isProduction ? 10 : 5,
      serverSelectionTimeoutMS: isProduction ? 10000 : 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0,
      // SSL للـ production فقط (MongoDB Atlas)
      ...(isProduction && mongoUrl.includes('mongodb+srv') && {
        ssl: true,
        sslValidate: true
      })
    };

    await mongoose.connect(mongoUrl, connectionOptions);
    
    console.log("✅ MongoDB Connected Successfully!");
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Seed البيانات الأولية
    try {
      await seedInitialProduts();
      console.log("✅ Initial products seeded!");
    } catch (seedError) {
      console.log("⚠️ Seed data already exists or failed:", seedError);
    }
    
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    
    // في الـ production، أوقف التطبيق
    if (isProduction) {
      process.exit(1);
    } else {
      console.log("⚠️ Running in development mode, continuing without database...");
    }
  }
}

// معالجة أحداث MongoDB
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB Error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Disconnected');
  
  // إعادة الاتصال في الـ production
  if (isProduction) {
    setTimeout(() => {
      console.log('🔄 Attempting to reconnect to MongoDB...');
      connectToMongoDB();
    }, 5000);
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB Reconnected');
});

// Routes
app.use("/user", userRouter);
app.use("/product", routerProduct);
app.use("/cart", routerCart);

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    availableRoutes: ["/user", "/product", "/cart", "/health"]
  });
});

// Error Handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Server Error:", error);
  res.status(500).json({ 
    error: "Internal Server Error",
    ...((!isProduction) && { message: error.message, stack: error.stack })
  });
});

// Graceful Shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`⚠️ ${signal} received, shutting down gracefully...`);
  
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// بدء الخادم
async function startServer() {
  try {
    // الاتصال بقاعدة البيانات
    await connectToMongoDB();
    
    // بدء الخادم
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`🌐 Access: ${isProduction ? 'Railway URL' : `http://localhost:${port}`}`);
      console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Missing'}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// تشغيل الخادم
startServer();

// Export للاختبارات
export default app;