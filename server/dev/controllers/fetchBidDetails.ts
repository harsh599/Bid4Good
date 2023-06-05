import { Request, Response } from "express";
import { Auction } from "../models/aunctionModel";

//Fecth the bid details
const fetchBidDetails = async (req: Request, res: Response) => {
    try {
      
      const bid_type = req.body.bidType;
      let details ;

      //fetches the details of specific bid type
      if(bid_type != null){
       details = await Auction.findAll({
          where: {
              auctionType:bid_type
          }
        });
      }

      //fetches the details of all the bid type
      else{
         details = await Auction.findAll({});
      }
    res.status(200).json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  fetchBidDetails,
};
//# sourceMappingURL=fetchBidDetails.js.map
