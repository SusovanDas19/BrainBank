import { model, Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId


const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String,required: true }
})

const OrgSchema = new Schema({
    OrgName: {type: String, required: true, unique: true},
    createdBy: {type: ObjectId, required: true, ref: 'users'},
    members: [{type: ObjectId, ref: 'users'}],
    admins: [{type: ObjectId, ref: 'users'}]
})

const newContentSchema = new Schema({
    title: {type: String, require: true},
    description: {type: String, required: true},
    type: {type: String, required: true},
    link: {type: String},
    date: {type: String},
    tags: {type: [String]},
    userId: {type: String, ref: 'users'},
    embedding:   { type: [Number], index: 'vectorSearch' },
})



const ShareBrainLinkSchema = new Schema({
    hash: {type: String, required: true},
    userId: {type: ObjectId, ref: 'users', required: true},
    type: {type: String, require: true}
})

const InviteLinkSchema = new Schema({
    orgId: {type: ObjectId, ref: 'users', require: true},
    tokenHash: {type: String, required: true, unique: true},
    createdBy: {type: ObjectId, ref: 'users', required: true},
    accessNumbers: {type: Number, default: 1}
})

export const UserModel = model("users", UserSchema);
export const newContentModel = model("content", newContentSchema);
export const ShareBrainlinkModel = model("shareBrainLinks",ShareBrainLinkSchema);
export const OrgModel = model("orgs",OrgSchema);
export const InviteLinkModel = model("inviteLinks", InviteLinkSchema);