import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { sequelize } from "../util/database";

/**
 * Fetches auction details including items and image details from the database
 * @param {Request} _ - Express request object (unused)
 * @param {Response} res - Express response object
 */
export const fetchDetails = async (_: Request, res: Response) => {
  try {
    // Perform a SELECT query to retrieve all relevant auction, item, and image details
    const results = await sequelize.query(
      `SELECT auctions.*, items.*, imageDetails.*
       FROM auctions
       INNER JOIN items ON items.auctionId = auctions.auctionId
       INNER JOIN imageDetails ON imageDetails.itemId = items.itemId
       WHERE items.isSold = false AND auctions.endTime > UTC_TIMESTAMP()`,
      {
        type: QueryTypes.SELECT,
      }
    );

    // Reduce the results into an object containing the desired auction, item, and image details
    const auctionDetails = results.reduce((acc: any, auction: any) => {
      const auctionId = auction.auctionId;
      const itemId = auction.itemId;

      // Check if auction already exists in the accumulator
      let auctionObj = acc[auctionId];

      if (!auctionObj) {
        // If not, create a new auction object and add it to the accumulator
        auctionObj = {
          auctionId: auctionId,
          auctionType: auction.auctionType,
          startTime: auction.startTime,
          endTime: auction.endTime,
          items: {},
        };
        acc[auctionId] = auctionObj;
      }

      // Check if item already exists in the auction object
      let itemObj = auctionObj.items[itemId];

      if (!itemObj) {
        // If not, create a new item object and add it to the auction object
        itemObj = {
          itemId: itemId,
          itemName: auction.itemName,
          imageDetails: [],
        };
        auctionObj.items[itemId] = itemObj;
      }

      // Push the image details to the item object
      itemObj.imageDetails.push({
        imgId: auction.imgId,
        imgUrl: auction.imgUrl,
        imgDescription: auction.imgDescription,
        imgName: auction.imgName,
      });

      return acc;
    }, {});

    // Combine auctionDetails and itemDetails into one object
    const combinedDetails = Object.keys(auctionDetails).map(
      (auctionId: string) => {
        const auctionObj = auctionDetails[auctionId];
        const itemsArray = Object.values(auctionObj.items);
        return {
          ...auctionObj,
          items: itemsArray,
        };
      }
    );

    // Send the combined details as a JSON response
    res.json({ details: combinedDetails });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching details" });
  }
};

export default {
  fetchDetails,
};
