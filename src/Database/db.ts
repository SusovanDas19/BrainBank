import { model, Schema } from "mongoose";
import { string } from "zod";
const ObjectId = Schema.ObjectId


const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String,required: true }
})

const OrgSchema = new Schema({
    OrgName: {type: String, required: true, unique: true},
    OrgPassword: {type: String, required: true},
    userId: {type: String, ref: 'users'},
})

const newContentSchema = new Schema({
    title: {type: String, require: true},
    description: {type: String, required: true},
    type: {type: String, required: true},
    link: {type: String},
    date: {type: String},
    tags: {type: [String]},
    userId: {type: String, ref: 'users'},
})



const LinkSchema = new Schema({
    hash: {type: String, required: true},
    userId: {type: ObjectId, ref: 'users', required: true, unique: true},
    userType: {type: String, require: true}
})

export const UserModel = model("users", UserSchema);
export const newContentModel = model("content", newContentSchema);
export const linkModel = model("links",LinkSchema);
export const OrgModel = model("orgs",OrgSchema);