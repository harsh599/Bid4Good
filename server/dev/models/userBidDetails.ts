import { DataTypes } from "sequelize";
import { sequelize } from "../util/database";

const userBiddingModel = sequelize.define("userBidDetails", {
  userBidId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  isWinner: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  bidAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  auctionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
export const userBidDetailsModel = userBiddingModel;
