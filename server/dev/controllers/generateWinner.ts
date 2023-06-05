import { Request, Response } from "express";
import { Auction } from "../models/aunctionModel";
import { userBidDetailsModel } from "../models/userBidDetails";
import { Item } from "../models/itemModel";
import { sequelize } from "../util/database";
import { sendEmail } from "../util/emailSender";
import { DataTypes, QueryTypes } from "sequelize";

/**
 * Represents a Sequelize model for a Winner, with firstName, lastName, email, userId and bidAmount fields.
 */
const Winner = sequelize.define("winner", {
  firstName: {
    field: "firstName",
    type: DataTypes.STRING,
  },
  lastName: {
    field: "lastName",
    type: DataTypes.STRING,
  },

  email: {
    field: "email",
    type: DataTypes.STRING,
  },
  userId: {
    field: "userId",
    type: DataTypes.INTEGER,
  },
  bidAmount: {
    field: "bidAmount",
    type: DataTypes.INTEGER,
  },
});

/**
 * Generates winners for ongoing auctions.
 *
 * @param _req - The HTTP request object (unused).
 * @param _res - The HTTP response object (unused).
 */
const generateWinner = async (_req: Request, _res: Response) => {
  //const auctionId = req.body.auctionId;
  const now = new Date();
  const auctions = await Auction.findAll({
    where: {
      auctionType: ["live", "blind"],
    },
  });

  for (const element of auctions) {
    const auction = element;

    // Check if auction has ended
    if (now > auction.getDataValue("endTime")) {
      const auctionId = auction.getDataValue("auctionId");
      console.log("id", auctionId);

      try {
        // Find the auction with the given ID
        const auction = await Auction.findOne({ where: { auctionId } });

        if (!auction) {
          throw new Error(`Auction with ID ${auctionId} not found`);
        }

        // Check if any bids exist for the auction
        const bidsExist = await userBidDetailsModel.findOne({
          where: {
            auctionId: auctionId,
          },
        });

        if (!bidsExist) {
          // No bids exist for the auction
          console.log(`No bids exist for auction ${auctionId}`);
          continue;
        }

        const results = await sequelize.query(
          `
      SELECT u.firstName, u.lastName, l.email, maxBid, u.userId
      FROM UserDetails u
      INNER JOIN (
       SELECT userId, userBidId, MAX(bidAmount) AS maxBid
      FROM userBidDetails
      WHERE auctionId = :auctionId
      AND isWinner = false
      GROUP BY userId
      ) b ON u.userId = b.userId
      INNER JOIN items i ON i.auctionId = :auctionId
      INNER JOIN loginDetails l ON l.user_id = u.userId 
      WHERE b.maxBid = (
          SELECT MAX(bidAmount) 
      FROM userBidDetails 
      WHERE auctionId = :auctionId
      AND i.isSold = false
       )
     AND b.maxBid > i.startPrice
      `,
          {
            type: QueryTypes.SELECT,
            replacements: { auctionId: auctionId },
            mapToModel: true,
            model: Winner,
          }
        );

        if (results && results.length > 0) {
          const winners = results.map((result) => ({
            firstName: result.getDataValue("firstName"),
            lastName: result.getDataValue("lastName"),
            userId: result.getDataValue("userId"),
            bidAmount: result.getDataValue("maxBid"),
            email: result.getDataValue("email"),
          }));

          if (winners != undefined || winners != null) {
            const firstname = winners[0].firstName;
            const lastName = winners[0].lastName;
            const bidAmount = winners[0].bidAmount;
            const userId = winners[0].userId;
            const email = winners[0].email;

            console.log(firstname, lastName);

            const Id = await userBidDetailsModel.findAll({
              where: {
                bidAmount: bidAmount,
                userId: userId,
              },
              attributes: ["userBidId"],
            });
            const userBidId = Id.map((result) => ({
              id: result.getDataValue("userBidId"),
            }));

            //  Update the isWinner column to true for the winning bid
            await userBidDetailsModel.update(
              { isWinner: true },
              { where: { userBidId: userBidId[0].id, auctionId: auctionId } }
            );

            // Update the Item's isSold field to true
            await Item.update({ isSold: true }, { where: { auctionId } });
            const sellerId = auction.getDataValue("user_id");
            const buyerId = userId;
            const item = await Item.findOne({
              where: {
                auctionId: auctionId,
              },
              attributes: ["itemId"],
            });
            const itemId = item?.getDataValue("itemId");
            await Item.update(
              { startPrice: bidAmount },
              { where: { itemId: itemId } }
            );

            const Url = `http://csci5308vm5.research.cs.dal.ca:5173/add-card?sellerId=${sellerId}&itemId=${itemId}&buyerId=${buyerId}`;
            // Send an email to the winner
            sendEmail(
              `<!DOCTYPE html>
      <html>
        <head>
          <title>Congratulations!</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
          <style>
            .container {
              background-color: #f8f9fa;
              border-radius: 10px;
              padding: 20px;
              margin-top: 50px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
            }
            h1 {
              color: #007bff;
            }
            ul {
              list-style: none;
              padding-left: 0;
            }
            button {
              background-color: #007bff;
              border-color: #007bff;
              color: white;
              font-weight: bold;
            }
            button:hover {
              background-color: #0069d9;
              border-color: #0062cc;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="text-center">Congratulations!</h1>
            <p>Dear ${firstname},</p>
            <p>You have just won an auction!</p>
            <h2>Order Details:</h2>
            <p>Click the button below to pay: ${bidAmount}</p>
            <div class="text-center">
              <button class="btn btn-primary"><a target="blank" href="${Url}" style="color: white;">Pay Now</a></button>
            </div>
            <p>Best regards,</p>
            <p>Development Team</p>
          </div>
          <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi4jizo" crossorigin="anonymous"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
        </body>
      </html>`,
              email
            );
            return { message: "Winner declared!" };
          }
        }
      } catch (err) {
        console.log(err);
        return { message: "No winner found" };
      }
    }
  }
};

export default { generateWinner };
