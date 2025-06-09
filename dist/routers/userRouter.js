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
const userServices_1 = require("../services/userServices");
const validateJWT_1 = __importDefault(require("../middleware/validateJWT"));
const router = express_1.default.Router();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        const { statusCode, data } = yield (0, userServices_1.register)({
            firstName,
            lastName,
            email,
            password,
        });
        res.status(statusCode).json(data);
    }
    catch (_a) {
        res.status(500).json("Something want wrong!");
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { statusCode, data } = yield (0, userServices_1.login)({ email, password });
        res.status(statusCode).json(data);
    }
    catch (_a) {
        res.status(500).json("Something want wrong!");
    }
}));
router.get("/my-order", validateJWT_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const { data, statusCode } = yield (0, userServices_1.getMyOrders)({ userId });
        res.status(statusCode).json(data);
    }
    catch (_a) {
        res.status(500).json("Something want wrong!");
    }
}));
exports.default = router;
