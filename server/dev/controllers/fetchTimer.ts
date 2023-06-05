import { Request, Response } from "express";
import { Auction } from "../models/aunctionModel"
import { sequelize } from "../util/database";

/**
 * Fetches the bid time details of the specified auction.
 * 
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
const fetchBidTime = async (req: Request, res: Response) => {
    const auctionId = req.body.auctionId;

    try {
        // Fetches the time details of the specified auction
        if (auctionId != null) {
            const auction = await Auction.findOne({
                attributes: [
                    [sequelize.literal("TIMEDIFF(endTime,startTime) "), "duration"],
                    [sequelize.fn('TIMESTAMPDIFF', sequelize.literal('SECOND'), sequelize.col('startTime'), sequelize.col('endTime')), 'seconds_duration']
                ],
                where: { auctionId: auctionId },
            });
            res.status(200).json(auction);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export default {
    fetchBidTime,
};
