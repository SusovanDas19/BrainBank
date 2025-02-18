import Router from "express";
import { Request, Response } from "express";
import { userAuth } from "../middlewares/userAuth";
import { newContentModel, UserModel } from "../Database/db";
const dataRouter = Router();

dataRouter.post("/add",userAuth,async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.userId || "";
    const { title, description, type, link } = req.body;

    await newContentModel.create({
      title,
      description,
      type,
      link,
      userId,
    });
    res.status(201).json({
      message: "New Content created successfully",
    });
    return;
  }
);


dataRouter.get("/fetch", userAuth, async (req:Request, res:Response): Promise<void> =>{
  const userId: string = req.userId || "";
  const contentType: string = req.query.type as string || "";

  try{
    const content = await newContentModel.find({
      type: contentType,
      userId: userId
    }).populate("userId", "username")

    if(content){
      res.status(201).json({
        message: "All content fetched.",
        AllContent: content
      })
    }else{
      res.status(400).json({
        message: "Unable to fetch all content"
      })
    }
  }catch(error){
    res.status(500).json({
      message: "Internal server error"
    })
  }
})

dataRouter.delete("/remove", userAuth, async (req: Request, res: Response): Promise<void>=>{
  const userId: string = req.userId || "";
  const contentId: string = req.body.contentId;

  try{
    const isValidContentId = await newContentModel.findOne({_id: contentId});
    if(!isValidContentId){
      res.status(400).json({
        message: "Contetnt does not found"
      });
      return;
    }

    await newContentModel.deleteOne({_id: contentId, userId: userId})

    res.status(200).json({
      message: "Content removed successfully"
    });
  }catch(error){
    res.status(500).json({
      message: "Internal server error"
    })
  }


})

export default dataRouter;
