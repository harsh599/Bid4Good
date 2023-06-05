import { DataTypes } from "sequelize";
import { sequelize } from "../util/database";

const WishlistModel = sequelize.define("WishlistModel", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export const Wishlist = WishlistModel;
