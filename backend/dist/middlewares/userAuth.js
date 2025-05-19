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
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../Database/db");
const jwtUserKey = process.env.JWT_USER_KEY;
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || "";
    const hash = req.body.hash;
    if (hash && !token) {
        const user = yield db_1.linkModel.find({ hash });
        if (user)
            return next();
        res.status(404).json({ message: "Share link not found" });
        return;
    }
    if (!token && !hash) {
        res.status(401).json({ message: "Token missing, authorization denied" });
        return;
    }
    try {
        const { userId } = jsonwebtoken_1.default.verify(token, jwtUserKey);
        if (userId) {
            req.userId = userId;
            next();
        }
        else {
            res.status(403).json({ message: "You are not logged in" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error during authentication" });
    }
});
exports.userAuth = userAuth;
