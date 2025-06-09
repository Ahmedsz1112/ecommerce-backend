"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialProduts = exports.getAllProduct = void 0;
const productModel_1 = require("../models/productModel");
const getAllProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield productModel_1.productModel.find();
});
exports.getAllProduct = getAllProduct;
const seedInitialProduts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = [
            {
                title: "Dell Laptop",
                image: "https://i5.walmartimages.com/asr/3a0b16b3-88f9-4797-a546-8a7a5f3d15cc.9cd02e837eeb8ced4ef44bdac35a84e9.jpeg",
                price: 15000,
                stoke: 8,
            },
            {
                title: "Hp Laptop",
                image: "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SX679_.jpg",
                price: 2000,
                stoke: 10,
            },
            {
                title: "Asus Laptop",
                image: "https://m.media-amazon.com/images/I/51VXgmHMm+L._AC_SY300_SX300_.jpg",
                price: 10000,
                stoke: 20,
            },
        ];
        const exsitingProduct = yield (0, exports.getAllProduct)();
        if (exsitingProduct.length === 0) {
            yield productModel_1.productModel.insertMany(products);
        }
    }
    catch (err) {
        console.log("cannot error database", err);
    }
});
exports.seedInitialProduts = seedInitialProduts;
