import { model, Schema } from "mongoose";
const ObjectId = Schema.ObjectId


const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String,required: true }
})

const newContentSchema = new Schema({
    title: {type: String, require: true},
    description: {type: String, required: true},
    type: {type: String, required: true},
    link: {type: String},
    createdAt: {type: Date},
    tags: {type: [{type: ObjectId, ref: 'Tags'}]},
    userId: {type: String, ref: 'users'},
})


const orgSchema = new Schema({
    username: {type: String, required: true},
    userId: {type: String, ref: 'users'},
})


const LinkSchema = new Schema({
    hash: {type: String, required: true},
    userId: {type: ObjectId, ref: 'users', required: true, unique: true}, 
})

export const UserModel = model("users", UserSchema);
export const newContentModel = model("content", newContentSchema);
export const linkModel = model("links",LinkSchema);