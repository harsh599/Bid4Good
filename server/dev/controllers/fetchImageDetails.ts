import { Request, Response } from "express";
import { ImageDetailModel } from "../models/imageDetails";
import { Item } from "../models/itemModel";

//To fetch the image details of each items
const fetchImageDetails = async (_req: Request, res: Response) => {
  try {
    const imageDetails = await ImageDetailModel.findOne({
        include: [{
            model: Item,
            attributes: ['itemId'] 
          }]
    });

    if (!imageDetails) {
      return res.status(404).json({ message: "Image details not found." });
    }
   
    console.log(imageDetails.getDataValue(0));
    const result = {
      imgId: imageDetails.getDataValue('imgId'),
      itemId: imageDetails.getDataValue('itemId'),
      imageUrl: imageDetails.getDataValue('imgUrl'),
      imageDes: imageDetails.getDataValue('imgDescription'),
      imageName: imageDetails.getDataValue('imgName'),
   };

    console.log(result);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default {
  fetchImageDetails,
};

