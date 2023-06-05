import { Request, Response } from "express";
import { Item } from "../models/itemModel";
const fetchBidItems = async (_req: Request, res: Response) => {
    try {
      const items = await Item.findAll({
      order: [
            ['itemName', 'ASC']
        ],
      });
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
export default  {
    fetchBidItems,
};

// //# sourceMappingURL=fetchBidItems.js.map