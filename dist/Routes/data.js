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
const userAuth_1 = require("../middlewares/userAuth");
const db_1 = require("../Database/db");
const dataRouter = (0, express_1.default)();
dataRouter.post("/add", userAuth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId || "";
        const { title, description, type, link, tags, date } = req.body;
        if (!title || !description || !type) {
            res.status(400).json({ error: "Title, description, and type are required." });
            return;
        }
        // Create new content
        yield db_1.newContentModel.create({
            title,
            description,
            type,
            link,
            tags,
            userId,
            date,
        });
        res.status(201).json({
            message: "New content created successfully",
        });
    }
    catch (error) {
        console.error("Error creating content:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
dataRouter.get("/fetch", userAuth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId || "";
    const contentType = req.query.type || "";
    try {
        const content = yield db_1.newContentModel.find({
            type: contentType,
            userId: userId
        }).populate("userId", "username");
        if (content) {
            res.status(201).json({
                message: "All content fetched.",
                AllContent: content
            });
        }
        else {
            res.status(400).json({
                message: "Unable to fetch all content"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}));
dataRouter.delete("/remove", userAuth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId || "";
    const { contentId } = req.body;
    try {
        const isValidContentId = yield db_1.newContentModel.findOne({ _id: contentId });
        if (!isValidContentId) {
            res.status(400).json({
                message: "Contetnt does not found"
            });
            return;
        }
        yield db_1.newContentModel.deleteOne({ _id: contentId, userId: userId });
        res.status(200).json({
            message: "Content removed successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}));
exports.default = dataRouter;
