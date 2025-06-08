import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter";
import { seedInitialProduts } from "./services/productServices";
import routerProduct from "./routers/productRouter";
import routerCart from "./routers/cartRouter";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());


const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is not defined!");
  process.exit(1);
}

mongoose
  .connect(dbUrl)
  .then(() => console.log("Mongo Connected!"))
  .catch((error) => console.log("Failed to Connect!", error));

seedInitialProduts();

app.use("/user", userRouter);
app.use("/product", routerProduct);
app.use("/cart", routerCart);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

