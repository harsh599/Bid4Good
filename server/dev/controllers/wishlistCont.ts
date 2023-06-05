import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { Wishlist } from "../models/wishlistModel";
import { sequelize } from "../util/database";

export const addWishlist = async (req: Request, res: Response) => {
  const { item_id, user_id } = req.query;
  try {
    const WishlistDetails = await Wishlist.create({
      item_id,
      user_id,
    });
    res.status(201).json({
      message: {
        WishlistDetails: WishlistDetails.get({ plain: true }),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err,
    });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  const { user_id } = req.query;
  try {
    const WishlistDetails = await sequelize.query(
      `SELECT items.*
    FROM items
    JOIN WishlistModels ON items.itemId = WishlistModels.item_id
    WHERE WishlistModels.user_id = ${user_id};`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.status(201).json(WishlistDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err,
    });
  }
};

export const deleteWishlistItem = async (req: Request, res: Response) => {
  const { item_id, user_id } = req.query;
  try {
    const deletedItem = await Wishlist.destroy({
      where: {
        item_id,
        user_id,
      },
    });
    if (deletedItem) {
      res.status(200).json({
        message: "Item deleted from wishlist",
      });
    } else {
      res.status(404).json({
        message: "Item not found in wishlist",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err,
    });
  }
};

export default {
  addWishlist,
  deleteWishlistItem,
  getWishlist,
};
