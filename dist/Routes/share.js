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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userAuth_1 = require("../middlewares/userAuth");
const db_1 = require("../Database/db");
const randomHash_1 = require("../utils/randomHash");
const shareRouter = (0, express_1.default)();
const shareLinkKey = process.env.JWT_SHARE_LINK_KEY || "ABfgk8912";
shareRouter.post("/link", userAuth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId || "";
    try {
        const hash = (0, randomHash_1.randomHash)(10);
        const profileLink = `http://localhost:5000/v1/share/details/${hash}`;
        yield db_1.linkModel.create({
            hash: hash,
            userId: userId
        });
        res.status(200).send({
            message: "Share link generated",
            hash: hash,
            link: profileLink,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}));
shareRouter.get("/details/:shareToken", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shareToken } = req.params;
        const decoded = jsonwebtoken_1.default.verify(shareToken, shareLinkKey);
        const userId = decoded.userId;
        const user = yield db_1.UserModel.findById(userId);
        if (!user) {
            res.status(400).json({
                message: "Link of the user does not exist",
            });
            return;
        }
        const allUserContent = yield db_1.newContentModel
            .find({ userId })
            .populate("userId", "username -_id");
        if (allUserContent) {
            res.status(200).json({
                message: "All content of the user fetched",
                allContent: allUserContent,
            });
            return;
        }
        else {
            res.status(400).json({
                message: "Unable to fetch all content",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}));
exports.default = shareRouter;
