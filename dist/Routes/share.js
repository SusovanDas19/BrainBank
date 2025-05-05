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
const express_1 = require("express");
const userAuth_1 = require("../middlewares/userAuth");
const db_1 = require("../Database/db");
const randomHash_1 = require("../utils/randomHash");
const shareRouter = (0, express_1.Router)();
const shareLinkKey = process.env.JWT_SHARE_LINK_KEY || "ABfgk8912";
const baseUrl = process.env.BASE_URL || "http://localhost:5000";
shareRouter.post("/link", userAuth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId || "";
    if (!userId) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
    }
    try {
        let existingLink = yield db_1.linkModel.findOne({ userId });
        let hash;
        let profileLink;
        if (!existingLink) {
            hash = (0, randomHash_1.randomHash)(10);
            yield db_1.linkModel.create({ hash, userId });
        }
        else {
            hash = existingLink.hash;
        }
        profileLink = `${baseUrl}/share/brain/show/${hash}`;
        res.status(200).json({
            message: "Share link generated",
            hash,
            link: profileLink,
        });
    }
    catch (error) {
        console.error("Error generating share link:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}));
shareRouter.delete("/link/delete", userAuth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId || "";
    if (!userId) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
    }
    try {
        const deleteLink = yield db_1.linkModel.findOneAndDelete({ userId });
        if (!deleteLink) {
            res.status(404).json({
                message: "No share link found to deactivate",
            });
            return;
        }
        res.status(200).json({
            message: "Share link deactivated",
        });
    }
    catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
shareRouter.get("/show/:hash", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hash } = req.params;
        const fetchUserId = yield db_1.linkModel.findOne({ hash });
        if (!fetchUserId) {
            res.status(404).json({ message: "Link not found" });
            return;
        }
        const userData = yield db_1.newContentModel
            .find({ userId: fetchUserId.userId })
            .select("-userId -__v")
            .lean();
        const user = yield db_1.UserModel.findById(fetchUserId.userId).select("username");
        if (!userData || !user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            username: user.username,
            user: userData,
        });
    }
    catch (e) {
        res.status(500).json({ message: "Server error" });
    }
}));
exports.default = shareRouter;
