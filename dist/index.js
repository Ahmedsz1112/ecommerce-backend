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
const port = process.env.PORT;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
mongoose_1.default
    .connect(process.env.MONGO_URL || '')
    .then(() => console.log("Mongo Connected!"))
    .catch((error) => console.log("Failed to Connect!", error));
(0, productServices_1.seedInitialProduts)();
app.use("/user", userRouter_1.default);
app.use("/product", productRouter_1.default);
app.use("/cart", cartRouter_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
