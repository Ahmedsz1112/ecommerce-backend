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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartServices_1 = require("../services/cartServices");
const validateJWT_1 = __importDefault(require("../middleware/validateJWT"));
const router = express_1.default.Router();
router.get("/", validateJWT_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const cart = yield (0, cartServices_1.getActiveCartForUser)({ userId, populateProduct: true });
        res.status(200).json(cart);
    }
    catch (_a) {
        res.status(500).json("Something want wrong!");
    }
}));
router.delete("/", validateJWT_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const { data, statusCode } = yield (0, cartServices_1.clearCart)({ userId });
        res.status(statusCode).json(data);
    }
    catch (_a) {
        res.status(500).json("Something want wrong!");
    }
}));
router.post("/items", validateJWT_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;
        const { data, statusCode } = yield (0, cartServices_1.addItemToCart)({
            userId,
            productId,
            quantity,
        });
        res.status(statusCode).json(data);
    }
    catch (_a) {
        res.status(500).json("Something want wrong!");
    }
}));
router.put("/items", validateJWT_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;
        const { data, statusCode } = yield (0, cartServices_1.updateitemsToCart)({
            userId,
            productId,
            quantity,
        });
        res.status(statusCode).json(data);
    }
    catch (_a) {
        res.status(500).json("Something want wrong!");
    }
}));
router.delete("/items/:productId", validateJWT_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
        const { data, statusCode } = yield (0, cartServices_1.deleteitemToCart)({
            userId,
            productId,
        });
        res.status(statusCode).json(data);
    }
    catch (_a) {
        res.status(500).json("Something want wrong!");
    }
}));
router.post("/checkout", validateJWT_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const { address } = req.body;
        const { data, statusCode } = yield (0, cartServices_1.checkout)({ userId, address });
        res.status(statusCode).json(data);
    }
    catch (_a) {
        res.status(500).json("Something want wrong!");
    }
}));
exports.default = router;
