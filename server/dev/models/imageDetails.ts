import { DataTypes } from "sequelize";
import { sequelize } from "../util/database";

const ImageDetail = sequelize.define(
  "imageDetails",
  {
    imgId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    imgDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING(4000),
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export const ImageDetailModel = ImageDetail;
