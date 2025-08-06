import * as dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
const { TwitterApi } = require("twitter-api-v2");
const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
import axios from "axios";
import { anyAuth } from "../middlewares/anyAuth";

const aiRouter = Router();

aiRouter.post(
  "/Youtube",
  anyAuth,
  async (req: Request, res: Response): Promise<void> => {
    const videoLink: string = req.body.link || "";
    const prompt: string =
      req.body.sendMessage || "give me info about this video:";

    if (!videoLink) {
      res
        .status(400)
        .json({ error: "videoLink is required in the request body." });
      return;
    }

    try {
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
        model: "gemini-2.5-pro",
        config: generationConfig,
        contents,
      });

      res.status(200).json({ response: result.text });
    } catch (error: any) {
      console.error("Error generating response:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
);



aiRouter.post("/Twitter",anyAuth, async (req: Request, res: Response): Promise<any> => {
  try {
    const tweetUrl = req.body.link;
    let tweetData = req.body.tweetData;

    if (!tweetUrl) {
      return res.status(400).json({ error: "Tweet URL is required." });
    }

    if (tweetData.length == 0) {

      // Extract tweet ID from URL
      const tweetIdMatch = tweetUrl.match(/status\/(\d+)/);
      if (!tweetIdMatch) {
        return res.status(400).json({ error: "Invalid Tweet URL format." });
      }
      const tweetId = tweetIdMatch[1];

      // Fetch tweet details
      const tweetResponse = await twitterClient.v2.get(`tweets/${tweetId}`, {
        "tweet.fields": "text",
      });
      tweetData = tweetResponse.data?.text;
      if (!tweetData) {
        return res.status(404).json({ error: "Tweet text not found." });
      }
    }

    // Prepare payload for Gemini API
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.API_KEY}`;
    const geminiPayload = {
      contents: [
        {
          parts: [
            {
              text: `Analyze the sentiment of the following tweet.  
              Respond with:
              1) One-word label: Positive / Negative / Neutral / Anger , or any as per your analysis
              2) A short justification (100 words).
              
              Tweet:
              "${tweetData}"`           
            },
          ],
        },
      ],
    };

    // Send request to Gemini API
    const geminiResponse = await axios.post(geminiEndpoint, geminiPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const sentimentAnalysis = geminiResponse.data;
    const sentimentText =
      sentimentAnalysis.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sentiment not found.";

    return res.json({
      tweetData,
      sentimentText,
    });
  } catch (error: any) {
    console.error("Error during analysis:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default aiRouter;
