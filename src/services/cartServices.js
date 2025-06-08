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
exports.checkout = exports.deleteitemToCart = exports.updateitemsToCart = exports.addItemToCart = exports.clearCart = exports.getActiveCartForUser = void 0;
const cartModel_1 = require("../models/cartModel");
const orderModel_1 = require("../models/orderModel");
const productModel_1 = require("../models/productModel");
const createCartForUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
    const cart = yield cartModel_1.cartModel.create({ userId, totalAmount: 0 });
    yield cart.save();
    return cart;
});
const getActiveCartForUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, populateProduct, }) {
    let cart;
    if (populateProduct) {
        cart = yield cartModel_1.cartModel
            .findOne({ userId, status: "active" })
            .populate("items.product");
    }
    else {
        cart = yield cartModel_1.cartModel.findOne({ userId, status: "active" });
    }
    if (!cart) {
        cart = yield createCartForUser({ userId });
    }
    return cart;
});
exports.getActiveCartForUser = getActiveCartForUser;
const clearCart = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
    const cart = yield (0, exports.getActiveCartForUser)({ userId });
    cart.items = [];
    cart.totalAmount = 0;
    yield cart.save();
    return { data: yield (0, exports.getActiveCartForUser)({ userId, populateProduct: true }), statusCode: 200 };
});
exports.clearCart = clearCart;
const addItemToCart = (_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, quantity, userId, }) {
    const cart = yield (0, exports.getActiveCartForUser)({ userId });
    const existsInCart = cart.items.find((p) => p.product.toString() === productId);
    if (existsInCart) {
        return { data: "Items Already exists in cart", statusCode: 400 };
    }
    const product = yield productModel_1.productModel.findById(productId);
    if (!product) {
        return { data: "Product Not Found", statusCode: 400 };
    }
    if (product.stoke < quantity) {
        return { data: "low stock for item", statusCode: 400 };
    }
    cart.items.push({ product: productId, unitPrice: product.price, quantity });
    cart.totalAmount += product.price * quantity;
    yield cart.save();
    return {
        data: yield (0, exports.getActiveCartForUser)({ userId, populateProduct: true }),
        statusCode: 200,
    };
});
exports.addItemToCart = addItemToCart;
const updateitemsToCart = (_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, quantity, userId, }) {
    const cart = yield (0, exports.getActiveCartForUser)({ userId });
    const existsInCart = cart.items.find((p) => p.product.toString() === productId);
    if (!existsInCart) {
        return { data: "Item dose not exist in cart", statusCode: 400 };
    }
    const product = yield productModel_1.productModel.findById(productId);
    if (!product) {
        return { data: "Product Not Found", statusCode: 400 };
    }
    if (product.stoke < quantity) {
        return { data: "low stock for item", statusCode: 400 };
    }
    existsInCart.quantity = quantity;
    const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);
    let total = calculateCartItems({ cartItems: otherCartItems });
    total += existsInCart.quantity * existsInCart.unitPrice;
    cart.totalAmount = total;
    yield cart.save();
    return {
        data: yield (0, exports.getActiveCartForUser)({ userId, populateProduct: true }),
        statusCode: 200,
    };
});
exports.updateitemsToCart = updateitemsToCart;
const deleteitemToCart = (_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, userId, }) {
    const cart = yield (0, exports.getActiveCartForUser)({ userId });
    const existsInCart = cart.items.find((p) => p.product.toString() === productId);
    if (!existsInCart) {
        return { data: "Item dose not exist in cart", statusCode: 400 };
    }
    const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);
    let total = calculateCartItems({ cartItems: otherCartItems });
    cart.items = otherCartItems;
    cart.totalAmount = total;
    yield cart.save();
    return {
        data: yield (0, exports.getActiveCartForUser)({ userId, populateProduct: true }),
        statusCode: 200,
    };
});
exports.deleteitemToCart = deleteitemToCart;
const calculateCartItems = ({ cartItems }) => {
    let total = cartItems.reduce((sum, product) => {
        sum += product.quantity * product.unitPrice;
        return sum;
    }, 0);
    return total;
};
const checkout = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, address }) {
    if (!address) {
        return { data: "Please add the address", statusCode: 400 };
    }
    const cart = yield (0, exports.getActiveCartForUser)({ userId });
    const orderItems = [];
    for (const item of cart.items) {
        const product = yield productModel_1.productModel.findById(item.product);
        if (!product) {
            return { data: "Product not found", statusCode: 400 };
        }
        const orderItem = {
            productTitle: product.title,
            productImage: product.image,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
        };
        orderItems.push(orderItem);
    }
    const order = yield orderModel_1.orderModel.create({
        orderItems,
        userId,
        total: cart.totalAmount,
        address,
    });
    yield order.save();
    cart.status = "completed";
    yield cart.save();
    return { data: order, statusCode: 200 };
});
exports.checkout = checkout;
