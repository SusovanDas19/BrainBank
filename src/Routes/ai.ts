import * as dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from "express";
import { userAuth } from "../middlewares/userAuth";
import { GoogleGenAI } from "@google/genai";

const aiRouter = Router();

aiRouter.post("/youtube", userAuth, async (req: Request, res: Response): Promise<void> => {
  const videoLink: string = req.body.videoLink || "";
  const prompt: string = req.body.sendMessage || "give me info about this video:";

  if (!videoLink) {
    res.status(400).json({ error: "videoLink is required in the request body." });
    return;
  }

  try {
    console.log("req come with link: ", videoLink)
    console.log("prompt: ", prompt);
    const ai = new GoogleGenAI({
      apiKey: process.env.API_KEY,
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const contents = [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: "video/*",
              fileUri: videoLink,
            },
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      config:generationConfig,
      contents,
    });

    console.log("End of response");
    res.status(200).json({ response: result.text });
  } catch (error: any) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

export default aiRouter;
