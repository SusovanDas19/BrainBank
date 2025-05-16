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
const db_1 = require("../Database/db");
const mongoose_1 = __importDefault(require("mongoose"));
const anyAuth_1 = require("../middlewares/anyAuth");
const genai_1 = require("@google/genai");
const dataRouter = (0, express_1.default)();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.API_KEY });
dataRouter.post("/add", anyAuth_1.anyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userId = req.actorId || "";
    const { title, description, type, link, tags, date } = req.body;
    try {
        if (!title || !description || !type) {
            res
                .status(400)
                .json({ error: "Title, description, and type are required." });
            return;
        }
        const alltags = Array.isArray(tags) && tags.length ? `Tags: ${tags.join(", ")}` : "";
        const textPayload = [
            `Title: ${title}`,
            ``,
            `Description: ${description}`,
            ``,
            `Type: ${type}`,
            alltags
        ].filter(Boolean).join("\n");
        const response = yield ai.models.embedContent({
            model: "text-embedding-004",
            contents: textPayload,
            config: { outputDimensionality: 768 }
        });
        const vector = (_c = (_b = (_a = response.embeddings) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.values) !== null && _c !== void 0 ? _c : [];
        // Create new content
        yield db_1.newContentModel.create({
            title,
            description,
            type,
            link,
            tags,
            userId,
            date,
            embedding: vector,
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
dataRouter.get("/fetch", anyAuth_1.anyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.actorId || "";
    const contentType = req.query.type || "";
    const latestId = req.query.latestId || "";
    try {
        const query = { type: contentType, userId: userId };
        if (latestId) {
            query._id = { $gt: new mongoose_1.default.Types.ObjectId(latestId) };
        }
        const content = yield db_1.newContentModel.find(query).select('-userId -embedding').sort({ _id: -1 });
        if (content) {
            res.status(201).json({
                message: "All content fetched.",
                AllContent: content,
            });
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
        });
    }
}));
dataRouter.get("/fetch/recent", anyAuth_1.anyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.actorId;
    const afterId = req.query.afterId;
    const query = {
        userId,
    };
    if (afterId && mongoose_1.default.Types.ObjectId.isValid(afterId)) {
        query._id = { $gt: new mongoose_1.default.Types.ObjectId(afterId) };
    }
    try {
        const recentPosts = yield db_1.newContentModel
            .find(query)
            .select('-userId -embedding')
            .sort({ _id: -1 })
            .limit(15)
            .lean();
        if (recentPosts.length > 0) {
            res.status(200).json({
                message: "Recent posts fetched successfully",
                recentPosts: recentPosts,
            });
            return;
        }
        else {
            res.status(204).json({ message: "No recent posts found." });
        }
    }
    catch (e) {
        res.status(500).json({ message: "Internal server error." });
    }
}));
dataRouter.delete("/remove", anyAuth_1.anyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.actorId || "";
    const { contentId } = req.body;
    try {
        const isValidContentId = yield db_1.newContentModel.findOne({
            _id: contentId,
        });
        if (!isValidContentId) {
            res.status(400).json({
                message: "Contetnt does not found",
            });
            return;
        }
        yield db_1.newContentModel.deleteOne({ _id: contentId, userId: userId });
        res.status(200).json({
            message: "Content removed successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}));
exports.default = dataRouter;
