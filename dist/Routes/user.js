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
const express_1 = require("express");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../Database/db");
const hashRound = parseInt(process.env.HASHROUND || "10", 10);
const jwtUserKey = process.env.JWT_USER_KEY || "abjcdsj45";
const userRouter = (0, express_1.Router)();
// Define the Zod schema
const validBodySchema = zod_1.z
    .object({
    username: zod_1.z
        .string()
        .min(2, { message: "Too short username" })
        .max(20, { message: "Max 20 characters allowed" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Too short password" })
        .max(25, { message: "Max 25 characters allowed" })
        .refine((password) => /[A-Z]/.test(password), {
        message: "Add one uppercase letter",
    })
        .refine((password) => /[a-z]/.test(password), {
        message: "Add one lowercase letter",
    })
        .refine((password) => /[0-9]/.test(password), {
        message: "Add one number",
    })
        .refine((password) => /[!@#$%^&*.]/.test(password), {
        message: "Add a special character",
    }),
    confirmPassword: zod_1.z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
});
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parsedBody = validBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
        const error = ((_a = parsedBody.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) || "Invalid input";
        res.status(400).json({ message: `Validation error: ${error}` });
        return;
    }
    const { username, password } = parsedBody.data;
    try {
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (existingUser) {
            res.status(400).send({ message: "Username already exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, hashRound);
        const newUser = yield db_1.UserModel.create({
            username: username,
            password: hashedPassword,
        });
        res.status(201).send({ message: "Signup Complete" });
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
}));
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(404).send({
            message: "Username and Password required",
        });
        return;
    }
    try {
        const user = yield db_1.UserModel.findOne({
            username: username,
        });
        if (!user) {
            res.status(400).send({
                message: "Invalid Username",
            });
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (validPassword) {
            const token = jsonwebtoken_1.default.sign({
                userId: user._id.toString(),
            }, jwtUserKey);
            res.status(200).send({
                message: "Signin Complete",
                username: username,
                token: token,
            });
            return;
        }
        else {
            res.status(400).send({
                message: "Invalid Credentials",
            });
        }
    }
    catch (error) {
        res.status(500).send({
            message: "Internal Server error",
        });
    }
}));
exports.default = userRouter;
