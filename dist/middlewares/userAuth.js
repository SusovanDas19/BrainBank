"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtUserKey = process.env.JWT_USER_KEY || "abjcdsj45";
const userAuth = (req, res, next) => {
    const token = req.headers.authorization || "";
    if (!token) {
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
};
exports.userAuth = userAuth;
