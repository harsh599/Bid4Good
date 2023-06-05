/**
Import necessary dependencies and models
*/
import { Request, Response } from "express";
import { cityProvince } from "../models/citiesState";
import { sequelize } from "../util/database";

/**
 * Fetch all unique province names from database
 * @param {Request} req - The request object
 * @param {Response} res - The response object
*/
const fetchStates = async (req: Request, res: Response) => {
try {
//Retrieval from db
    console.log(req);
    const provinces = await cityProvince.findAll({
    attributes: [
      [
      sequelize.fn("DISTINCT", sequelize.col("province_name")),
      "province_name",
      ],
      ],
      order: [["province_name", "ASC"]],
    });

res.status(200).json(provinces);
} catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
}
};

/**
 * Fetch all the cities of a particular province from the database
 * @param {Request} req - The request object with query param containing province name
 * @param {Response} res - The response object
*/
const fetchCity = async (req: Request, res: Response) => {
try {
    // Retrieval from db
    const cities = await cityProvince.findAll({
    where: {
    province_name: req.query.province,
    },
      attributes: ["city"],
      order: [["city", "ASC"]],
      });
    res.status(200).json(cities);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
}
};
// Export handlers
export default {
fetchCity,
fetchStates,
};




