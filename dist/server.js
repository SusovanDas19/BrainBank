"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./Routes/user"));
const share_1 = __importDefault(require("./Routes/share"));
const data_1 = __importDefault(require("./Routes/data"));
const cors_1 = __importDefault(require("cors"));
const ai_1 = __importDefault(require("./Routes/ai"));
const org_1 = __importDefault(require("./Routes/org"));
const switch_1 = __importDefault(require("./Routes/switch"));
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGODB_URL || "";
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
app.use(express_1.default.json());
app.use("/v1/user", user_1.default);
app.use("/v1/org", org_1.default);
app.use("/v1/switch", switch_1.default);
app.use("/v1/share/brain", share_1.default);
app.use("/v1/content", data_1.default);
app.use("/v1/Ai", ai_1.default);
// app.use("/v1/find/", );
mongoose_1.default
    .connect(mongoUrl)
    .then(() => {
    console.log("Connected to Mongodb");
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
})
    .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});
