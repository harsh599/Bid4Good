import { Request, Response } from "express";
import { hashPassword, checkPassword } from "../util/passwordHashing";
import { UserDetail } from "../models/userDetailModel";
import { LoginDetail } from "../models/loginDetailModel";
import { sendEmail } from "../util/emailSender";
import { WELCOMEMESSAGE } from "../util/constants";

/**
 * Registers a new user with the provided information and sends a welcome email.
 *
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @returns The user and login details in the response.
 */
export const registerUser = async (req: Request, res: Response) => {
  // Extract data from request body
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    isBuyer,
    isSeller,
    phone,
    address,
    cityName,
    provinceName,
    govtIdUrl,
    email,
    password,
    postalCode,
  } = req.body;

  let userId = "";
  try {
    // Create a new user detail instance
    const userDetail = await UserDetail.create({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      isBuyer,
      isSeller,
      govtIdUrl,
      phone,
      address,
      cityName,
      provinceName,
      postalCode,
    });

    // Get the user ID
    userId = userDetail.get().userId;

    // Create a new login detail instance and associate it with the user detail instance
    const hashedPassword = await hashPassword(password);
    const loginDetail = await LoginDetail.create({
      user_id: userId,
      email,
      isAdmin: "false",
      isVerified: "false",
      password: hashedPassword,
    });
    sendEmail(WELCOMEMESSAGE, email).then((res) => {
      console.log(res);
    });
    // Send response with user and login details
    res.status(201).json({
      message: {
        userDetail: userDetail.get({ plain: true }),
        loginDetail: loginDetail.get({ plain: true }),
      },
    });
  } catch (err) {
    // If there is an error, delete the user detail instance and send an error response
    UserDetail.destroy({
      where: {
        userId,
      },
    });

    console.log(err);
    res.status(500).json({
      message: err,
    });
  }
};

/**
 * Retrieves user details for all users in the database.
 *
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @returns The user details in the response.
 */
const showUser = (req: Request, res: Response) => {
  console.log(req);

  // Find all user details and send response
  UserDetail.findAll({
    attributes: [
      "firstName",
      "lastName",
      "dateOfBirth",
      "isSeller",
      "isBuyer",
      "govtIdUrl",
      "phone",
      "address",
      "cityName",
      "provinceName",
    ],
  }).then((result) => {
    res.send(result);
  });
};

/**
 * Checks if a user with the given email already exists in the database.
 *
 * @param req - The incoming request object with the email to check.
 * @param res - The outgoing response object.
 * @returns A message indicating if the user exists or not.
 */
const checkUserExists = async (req: Request, res: Response) => {
  try {
    const requestedUserEmail = req.body.email;
    const result = await LoginDetail.findOne({
      where: {
        email: requestedUserEmail,
      },
    });

    if (result) {
      res.status(200).json({
        message: "User Exists",
        isUserAlreadyPresent: true,
      });
    } else {
      res.status(200).json({
        message: "User Doesn't Exist",
        isUserAlreadyPresent: false,
      });
    }
  } catch (error) {
    console.error("Error checking if user exists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Authenticate a user with the specified email and password
 * @param req - Express request object with a JSON body containing the email and password to authenticate
 * @param res - Express response object to send the response back to the client
 * @returns A JSON response with a boolean flag indicating if the authentication succeeded or not
 */
const checkLoginCredentials = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const login = await LoginDetail.findOne({ where: { email } });
    if (!login) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const loginDetails = login.get({ plain: true });
    const user = await UserDetail.findByPk(loginDetails.user_id);
    const userDetails = user?.get({ plain: true });

    const passwordMatches = await checkPassword(
      password,
      loginDetails.password
    );
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = loginDetails.user_id;

    console.log(req.session.userId);

    res.status(200).json({
      message: {
        userId: loginDetails.user_id,
        email: loginDetails.email,
        isVerified: loginDetails.isVerified,
        isSeller: userDetails.isSeller,
        isBuyer: userDetails.isBuyer,
        sessionId: req.session.id,
      },
    });
  } catch (error) {
    console.error("Error checking login credentials:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a user with the specified email from the database
 * @param req - Express request object with a JSON body containing the email of the user to delete
 * @param res - Express response object to send the response back to the client
 * @returns A JSON response with a boolean flag indicating if the deletion succeeded or not
 */
const logoutUser = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  console.log(sessionId, req.session.id);

  console.log(`Destroying session ${sessionId}`);
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to destroy session" });
    } else {
      res.status(200).json({ message: "Session destroyed" });
    }
  });
};

const getCurrentUserDetails = async (req: Request, res: Response) => {
  const userId = req.query.user;
  if (userId) {
    try {
      console.log(req);
      const currentUserDetails = await UserDetail.findOne({
        include: [
          {
            model: LoginDetail,
            attributes: ["email"],
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
          userId: userId,
        },
      });
      if (currentUserDetails) {
        res.status(200).json(currentUserDetails);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server error" });
    }
  } else {
    res.status(400).json({ message: "Invalid User ID" });
  }
};

/**
 * Updates a user details in  the database
 * @param req - Express request object with a JSON body containing the email of the user to delete
 * @param res - Express response object to send the response back to the client
 * @returns A JSON response with a boolean flag indicating if the deletion succeeded or not
 */
const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      phone,
      address,
      cityName,
      provinceName,
      postalCode,
      userId,
    } = req.body;
    const updateUserDetail = await UserDetail.findOne({
      where: {
        userId: userId,
      },
    });
    updateUserDetail?.update({
      firstName,
      lastName,
      dateOfBirth,
      phone,
      address,
      cityName,
      provinceName,
      postalCode,
    });
    res.status(200).json({
      isSuccessfull: true,
      message: {
        description: "Details Updated Successfully",
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export default {
  registerUser,
  showUser,
  checkUserExists,
  checkLoginCredentials,
  logoutUser,
  getCurrentUserDetails,
  updateUserDetails,
};
