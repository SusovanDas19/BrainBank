"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgModel = exports.linkModel = exports.newContentModel = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Schema.ObjectId;
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const OrgSchema = new mongoose_1.Schema({
    OrgName: { type: String, required: true, unique: true },
    OrgPassword: { type: String, required: true },
    userId: { type: String, ref: 'users' },
});
const newContentSchema = new mongoose_1.Schema({
    title: { type: String, require: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    link: { type: String },
    date: { type: String },
    tags: { type: [String] },
    userId: { type: String, ref: 'users' },
});
const LinkSchema = new mongoose_1.Schema({
    hash: { type: String, required: true },
    userId: { type: ObjectId, ref: 'users', required: true, unique: true },
    userType: { type: String, require: true }
});
exports.UserModel = (0, mongoose_1.model)("users", UserSchema);
exports.newContentModel = (0, mongoose_1.model)("content", newContentSchema);
exports.linkModel = (0, mongoose_1.model)("links", LinkSchema);
exports.OrgModel = (0, mongoose_1.model)("orgs", OrgSchema);
