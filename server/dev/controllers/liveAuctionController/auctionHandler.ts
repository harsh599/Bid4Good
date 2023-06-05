import { Request, Response } from "express";
import { Auction } from "../../models/aunctionModel";
import { ImageDetailModel } from "../../models/imageDetails";
import { Item } from "../../models/itemModel";
import { userBidDetailsModel } from "../../models/userBidDetails";
import { QueryTypes } from "sequelize";
import { sequelize } from "../../util/database";
import { UserDetail } from "../../models/userDetailModel";

/**
 * Handles placing a bid
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const makeBid = (req: Request, res: Response) => {
  console.log("Bid hit", res, req);
};

/**
 * Shows the current list of auctions
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const showCurrentAuctions = (req: Request, res: Response) => {
  console.log("fetch Auction list", res, req);
};

/**
 * Retrieves details of a specific auction
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const getAuctionDetails = async (req: Request, res: Response) => {
  try {
    await Auction.findOne({
      where: {
        auctionId: req.body.bidId,
      },
    }).then((result) => {
      res.status(200).json(result);
    });
  } catch {
    console.log("getAuctionDetails Failed");
  }
};

/**
 * Retrieves details of a specific auction item, along with associated images and user count
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const getAuctionItemDetails = async (req: Request, res: Response) => {
  let responseSent = false; // initialize flag
  try {
    const userCount = await checkForUser(req, res);

    await Item.findOne({
      where: {
        itemId: req.body.itemId,
      },
      include: [
        {
          model: ImageDetailModel,
        },
        {
          model: Auction,
        },
      ],
    }).then((result) => {
      if (!responseSent) {
        // check if response has already been sent
        res.status(200).json({
          item: result,
          userCount: userCount, // add the userCount to the response object
        });
        responseSent = true; // set flag to true
      }
    });
  } catch (error) {
    console.error(error);
    if (!responseSent) {
      // check if response has already been sent
      res.status(500).json({ message: "Server Error" });
      responseSent = true; // set flag to true
    }
  }
};

/**
 * Checks the number of users who have placed bids on a specific item in a specific auction
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<number>} - The number of users who have placed bids on the specified item and auction
 */
interface CountResult {
  "COUNT(userId)": number;
}

/**
 * Checks for the number of bids made by a user for a particular item in an auction.
 * @async
 * @function
 * @param {Request} req - The HTTP request object containing the `userId`, `auctionId`, and `itemId`.
 * @param {Response} _ - The HTTP response object.
 * @returns {Promise<number>} - The number of bids made by the user.
 */
const checkForUser = async (req: Request, _: Response) => {
  let userId = req.body.userId;
  let auctionId = req.body.auctionId;
  let itemId = req.body.itemId;
  try {
    const results: CountResult[] = await sequelize.query(
      `
      select count(userId) as "COUNT(userId)" from userBidDetails 
      where itemId = ` +
        itemId +
        ` and auctionId = ` +
        auctionId +
        ` and userId = ` +
        userId +
        `;
      `,
      {
        type: QueryTypes.SELECT,
      }
    );
    const count = results[0]["COUNT(userId)"];
    console.log("No of users", count);
    return count;
  } catch (error) {
    
  }
};

/**
 * Retrieves all images associated with an item.
 * @async
 * @function
 * @param {Request} req - The HTTP request object containing the `itemId`.
 * @param {Response} res - The HTTP response object.
 */
const getImages = async (req: Request, res: Response) => {
  await ImageDetailModel.findAll({
    where: {
      itemId: req.body.itemId,
    },
  })
    .then((result) => {
      // console.log(result)
      res.status(200).json(result);
    })
    .catch((result) => {
      res.status(500).send(result);
    });
};

/**
 * Returns the end time of an auction.
 * @function
 * @param {Request} _req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
const endTime = (_req: Request, res: Response) => {
  console.log("timer");

  res.status(200).json({
    message: {
      time: 3000,
    },
  });
};


/**
 * Finds the highest bid amount for a particular auction.
 * @function
 * @param {Request} req - The HTTP request object containing the `auctionId`.
 * @param {Response} res - The HTTP response object.
 */
const findMaxBidAmount = (req: Request, res: Response) => {
  userBidDetailsModel
    .max("bidAmount", {
      where: {
        auctionId: req.body.auctionId,
      },
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((res) => {
      console.log(res);
    });
};
/**
 * Retrieves the bid amount of a user in a blind auction.
 * @function
 * @param {Request} req - The HTTP request object containing the `itemId` and `userId`.
 * @param {Response} res - The HTTP response object.
 */
const fetchBlindBidAmount = (req: Request, res: Response) => {

  userBidDetailsModel.findOne({
    where: {
      itemId: req.query.itemId,
      userId: req.query.userId,
    },
    attributes: ['bidAmount'],
    order: [['createdAt', 'DESC']], 
    include: [{
      model: Auction,
      where: { auctionType: 'blind' }, 
      attributes: []
    }]
  }).then((result) => {
    if (result === null) {
      res.status(200).json({ bidAmount: 0 });
    } else {
      res.status(200).json(result);
    }
  }).catch((error) => {
    console.log(error);
  });
};

/**
 * Finds the highest bid amount made by a user for a particular item in an auction.
 * @function
 * @param {Request} req - The HTTP request object containing the `auctionId` and `userId`.
 * @param {Response} res - The HTTP response object.
 */
const findMyBidAmount = (req: Request, res: Response) => {
  userBidDetailsModel
    .max("bidAmount", {
      where: {
        itemId: req.body.auctionId,
        userId: req.body.userId,
      },
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((res) => {
      console.log(res);
    });
};

const validateAmount = () => {
  console.log();
};


/**
 * Retrieves the top five bidders for a particular auction.
 * @function
 * @param {Request} req - The HTTP request object containing the `auctionId`.
 * @param {Response} res - The HTTP response object.
 */
const topFiveUsers = (req: Request, res: Response) => {
  const auctionId = req.body.auctionId;

  userBidDetailsModel
    .findAll({
      where: {
        auctionId: auctionId,
      },
      include: {
        model: UserDetail,
        attributes: ["firstName", "lastName", "userId"],
      },
      attributes: ["bidAmount"],
      order: [["bidAmount", "DESC"]],
      limit: 5,
    })
    .then((result) => {
      console.log("5 User send to Client.");
      res.status(200).send(result);
    })
    .catch((result) => {
      console.log("topFiveUsers in auctionHandler Failed." + result);
      res.status(401).send({
        message: "Top Five user can not be fetched for this auction.",
      });
    });
};

export default {
  makeBid,
  showCurrentAuctions,
  getAuctionDetails,
  getAuctionItemDetails,
  getImages,
  endTime,
  validateAmount,
  findMaxBidAmount,
  findMyBidAmount,
  checkForUser,
  topFiveUsers,
  fetchBlindBidAmount,
};
