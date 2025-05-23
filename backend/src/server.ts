import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import userRouter from "./Routes/user";
import shareRouter from "./Routes/share";
import dataRouter from "./Routes/data";
import cors from "cors";
import aiRouter from "./Routes/ai";
import orgRouter from "./Routes/org";
import switchRouter from "./Routes/switch";
import searchRouter from "./Routes/search";
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGODB_URL || "";
const app = express();

app.use(cors({origin: "http://localhost:5173"}))

app.use(express.json());

app.use("/v1/user", userRouter);
app.use("/v1/org", orgRouter);
app.use("/v1/switch",switchRouter)
app.use("/v1/share/brain", shareRouter);
app.use("/v1/content", dataRouter);
app.use("/v1/Ai", aiRouter)
app.use("/v1/search", searchRouter);
// app.use("/v1/find/", );

mongoose
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
