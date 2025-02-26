"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkModel = exports.newContentModel = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Schema.ObjectId;
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const newContentSchema = new mongoose_1.Schema({
    title: { type: String, require: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    link: { type: String },
    createdAt: { type: Date },
    tags: { type: [String] },
    userId: { type: String, ref: 'users' },
});
const orgSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    userId: { type: String, ref: 'users' },
});
const LinkSchema = new mongoose_1.Schema({
    hash: { type: String, required: true },
    userId: { type: ObjectId, ref: 'users', required: true, unique: true },
});
exports.UserModel = (0, mongoose_1.model)("users", UserSchema);
exports.newContentModel = (0, mongoose_1.model)("content", newContentSchema);
exports.linkModel = (0, mongoose_1.model)("links", LinkSchema);
