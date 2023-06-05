/**

Import necessary dependencies and models.
*/
import { Request, Response } from "express";
import { Item } from "../models/itemModel";
import { Auction } from "../models/aunctionModel";
import { ImageDetailModel } from "../models/imageDetails";

/**Handler for adding items listed for bidding.
 * @param {Request} req - The request object containing the item details.
 * @param {Response} res - The response object to send the response.
 * @returns {void}
*/

export const addBidItems = async (req: Request, res: Response): Promise<void> => {
// Extract relevant data from request body
const {
itemName,
itemDes,
startPrice,
startTime,
endTime,
auctionType,
isSold,
address,
cityName,
provinceName,
postalCode,
imageDetails,
userId
} = req.body;
const user_id = userId;
try {
// Create a new instance of auction and store the auction id returned
const auctionDetail = await Auction.create({
startTime,
endTime,
auctionType,
address,
cityName,
provinceName,
postalCode,
user_id
}, {
returning: ['auctionId']
})
const auctionId = auctionDetail.getDataValue('auctionId');

// Create a new instance of item and store the item id returned
const itemDetail = await Item.create({
itemName,
itemDes,
isSold,
user_id,
startPrice,
auctionId
}, {
returning: ['itemId']
});
const itemId = itemDetail.getDataValue('itemId');

// Create an array of promises to create image details
const imageDetailPromises = imageDetails.map((image: any) =>
ImageDetailModel.create({
imgDescription: image.imgDescription,
imgName: image.imgName,
imgUrl: image.imgUrl,
itemId : itemId
})
);

// Execute the promises to create image details
const imageDetailsResults = await Promise.all(imageDetailPromises);

// Send response with item and bid details
res.status(201).json({
message: {
itemDetail: itemDetail.get({ plain: true }),
auctionDetail: auctionDetail.get({ plain: true }),
imageDetailsPlain :imageDetailsResults.map((result) =>
result.get({ plain: true })
)
},
});
}
catch (err) {
// Catch and handle errors
console.log(err);
res.status(500).json({
message: err,
});
}
};

/**
 * Handler for retrieving item details.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the response.
 * @returns {void}
*/
const showItemDetails = (req: Request, res: Response): void => {
console.log(req);
// Find all item details and send response
Item.findAll({
attributes: ["itemName", "itemDes", "startPrice"],
}).then((result) => {
res.send(result);
});
};

/**
 * Handler for retrieving auction details.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the response.
 * @returns {void}
*/
const showAuctionDetails = (req: Request, res: Response): void => {
console.log(req);
// Find all auction details and send response
Auction.findAll({
attributes: ["startTime", "endTime", "bidType", "isSold"],
}).then((result) => {
res.send(result);
  });
};

// Export handlers
export default {
  addBidItems,
  showAuctionDetails,
  showItemDetails,
};
