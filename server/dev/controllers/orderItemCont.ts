import { Request, Response } from "express";
import { sequelize } from "../util/database";
import { QueryTypes } from "sequelize";

import { orderDetail } from "../models/orderDetailsModel";
import { Item } from "../models/itemModel";

/**
 * Adds a new order to the database.
 * @param req - The request object.
 * @param res - The response object.
 */
export const addOrder = async (req: Request, res: Response) => {
  const { buyerId, sellerId, itemId, isSold } = req.body;
  try {
    const order = await orderDetail.create({
      buyerId: buyerId,
      sellerId: sellerId,
      itemId: itemId,
    });
    Item.update(
      { isSold: isSold }, // updated values
      { where: { itemId: itemId } } // condition
    );
    res.status(201).json({
      message: {
        order: order.get({ plain: true }),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err,
    });
  }
};

/**
 * Retrieves all orders for a specified buyer from the database.
 * @param req - The request object.
 * @param res - The response object.
 */
export const getOrder = async (req: Request, res: Response) => {
  const { buyerId } = req.query;
  try {
    // Fetch all order details and include associated items
    const results = await sequelize.query(
      `SELECT orderId,buyerId,orderDetails.itemId,items.itemName,items.startPrice,items.itemDes,items.isSold
      FROM orderDetails
      JOIN items ON orderDetails.itemId = items.itemId
      WHERE orderDetails.buyerId = ${buyerId};`,
      {
        // replacements: { buyerId: buyerId },
        type: QueryTypes.SELECT,
      }
    );

    // Return the order details as JSON
    res.json(results);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching orders" });
  }
};

export default {
  addOrder,
  getOrder,
};
