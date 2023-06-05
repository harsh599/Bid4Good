// Importing necessary modules and models
import { Request, Response } from "express";
import { LoginDetail } from "../models/loginDetailModel";
import { UserDetail } from "../models/userDetailModel";

console.log("Admin Controller"); // A console.log statement to print a message

/**
 * An asynchronous function to get all verified sellers' details
 * @param req The request object
 * @param res The response object
 * @returns A JSON response with the details of verified sellers
 */
const getVerfiedSellers = async (req: Request, res: Response) => {
  try {
    console.log(req); // A console.log statement to print the request object
    // Retrieving all the necessary details of verified sellers from the database
    const verifiedSellers = await UserDetail.findAll({
      include: [
        {
          model: LoginDetail,
          attributes: ["email", "isVerified"],
          where: {
            isVerified: 0,
          },
        },
      ],
      attributes: [
        "userId",
        "firstName",
        "lastName",
        "dateOfBirth",
        "isBuyer",
        "isSeller",
        "phone",
        "address",
        "cityName",
        "provinceName",
        "postalCode",
        "govtIdUrl",
      ],
      where: {
        isSeller: 1,
      },
    });
    // Sending the response with the verified sellers' details
    if (verifiedSellers.length > 0) {
      res.status(200).json(verifiedSellers);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error(error); // A console.error statement to print the error object
    res.status(500).json({ message: "Internal Server error" }); // Sending an error response
  }
};

/**
 * An asynchronous function to mark a seller as verified
 * @param req The request object
 * @param res The response object
 * @returns A JSON response indicating whether the update was successful
 */
const markAsVerifiedSeller = async (req: Request, res: Response) => {
  try {
    const {userId, isVerified} = req.body?.query; // Retrieving the user ID and verification status from the request body

    // Finding the login details of the user
    const updateLoginDetail = await LoginDetail.findOne({
      where: {
        user_id: userId,
      },
    });

    // Updating the verification status of the user
    updateLoginDetail?.update({ isVerified: isVerified });

    // Sending a success response with a message
    res.status(200).json({
      isSuccessfull: true,
      message: {
        description: "Details Updated Successfully",
        // result: updateLoginDetail,
      },
    });
  } catch (error) {
    console.error(error); // A console.error statement to print the error object
    res.status(500).json({ message: "Internal Server error" }); // Sending an error response
  }
};

// Exporting the functions as an object
export default {
  getVerfiedSellers,
  markAsVerifiedSeller,
};
