import { DataTypes } from "sequelize";
import { sequelize } from "../util/database";

const auctionModel = sequelize.define("auction", {
  auctionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  auctionType: {
    type: DataTypes.ENUM("live", "blind", "simple"),
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },

  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  cityName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provinceName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
export const Auction = auctionModel;
