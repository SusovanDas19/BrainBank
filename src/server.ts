import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import userRouter from "./Routes/user";
import shareRouter from "./Routes/share";
import dataRouter from "./Routes/data";
import cors from "cors";
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGODB_URL || "";
const app = express();

app.use(cors({origin: "http://localhost:5173"}))

app.use(express.json());

app.use("/v1/user", userRouter);
app.use("/v1/share/brain", shareRouter);
app.use("/v1/content", dataRouter);
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
