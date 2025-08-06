import { GoogleGenAI } from "@google/genai";
import { Router, Request, Response } from "express";
import { anyAuth } from "../middlewares/anyAuth";
import { newContentModel } from "../Database/db";
import mongoose from "mongoose";

const searchRouter = Router();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

searchRouter.post(
  "/relevent",
  anyAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.body;
      const actorId = req.actorId;


      if (!query) {
        res.status(400).json({ error: "Query text required." });
        return;
      }
      if (!actorId) {
        res.status(401).json({ error: "Authentication failed." });
        return;
      }

      const aiRes = await ai.models.embedContent({
        model: "text-embedding-004",
        contents: query,
        config: { outputDimensionality: 768 },
      });

      const qVec: number[] = aiRes.embeddings?.[0]?.values ?? [];

      if (qVec.length === 0) {
        res.status(500).json({ error: "Failed to embed query." });
        return;
      }

      const results = await newContentModel.aggregate([
        {
          $search: {
            index: "BrainBankVectorSearch",
            knnBeta: {
              path: "embedding",
              vector: qVec,
              k: 5,
            },
          },
        },
        {
          $match: {
            userId: actorId,
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            link: 1,
            type: 1,
            tags: 1,
            date: 1,
            score: { $meta: "searchScore" },
          },
        },
        { $sort: { score: -1 } },
      ]);

      res.status(200).json({
        message: "Vector search done",
        data: results,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default searchRouter;
