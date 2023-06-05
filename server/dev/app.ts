import express from "express";
import bodyParser from "body-parser";

import http from "http";
import session from "express-session";

import { registerRoutes } from "./routes/registerRoutes";
import { fetch } from "./routes/formRoutes";
import { bidRoutes } from "./routes/bidRoutes";
import { orderRoutes } from "./routes/orderRoutes";
import { auctionRoutes } from "./routes/auctionRoutes/auctionRoutes";
import { reportRoutes } from "./routes/reportRoutes";

import { UserDetail } from "./models/userDetailModel";
import { Auction } from "./models/aunctionModel";
import { Report } from "./models/reportsModel";
import { LoginDetail } from "./models/loginDetailModel";
import { Item } from "./models/itemModel";
import { sequelize } from "./util/database";
import { ImageDetailModel } from "./models/imageDetails";

import { userBidDetailsModel } from "./models/userBidDetails";

import { initSocket } from "./util/socket";

import cors,{ CorsOptions } from "cors";
import { wishListRoutes } from "./routes/wishListRoutes";
import { Wishlist } from "./models/wishlistModel";
import * as path from "path"


import * as dotenv from 'dotenv';
const envFilePath = path.resolve(__dirname, '../../.env');
console.log(envFilePath);
dotenv.config({path:envFilePath});


declare module "express-session" {
  interface Session {
    userId: string;
  }
}

const app = express();

const server: http.Server = http.createServer(app);

// Initialize your Socket.io server
initSocket(server);

app.use(
  session({
    secret: "wearegroup5", // replace with your own secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if using HTTPS
      maxAge: 60 * 60 * 1000, // session expires after 1 day
      httpOnly: true,
    },
  })
);

//api configration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (
      origin === "http://localhost:5173" ||
      origin === "http://127.0.0.1:5173" ||
      origin === "http://csci5308vm5.research.cs.dal.ca:8080" ||
      origin === "http://localhost:8080" ||
      origin === "http://csci5308vm5.research.cs.dal.ca:5173"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {

  const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173","http://csci5308vm5.research.cs.dal.ca:8080","http://localhost:8080","http://csci5308vm5.research.cs.dal.ca:5173"];


  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin!)) {
    res.setHeader("Access-Control-Allow-Origin", origin!);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//api middlewares
app.use("/api/v1/register", registerRoutes);
app.use("/api/fetch", fetch);
app.use("/api/bid", bidRoutes);
app.use("/api/v1/sell", orderRoutes);
app.use("/api/auction/", auctionRoutes);
app.use("/api/report/", reportRoutes);
app.use("/api/wishlist/", wishListRoutes);

UserDetail.hasMany(Report, { foreignKey: "user_id" });
Report.belongsTo(UserDetail, { foreignKey: "user_id" });

UserDetail.hasOne(LoginDetail, { foreignKey: "user_id" });

LoginDetail.belongsTo(UserDetail, { foreignKey: "user_id" });

// City belongsTo State

UserDetail.hasMany(Item, { foreignKey: "user_id" });

// Item belongsTo User
Item.belongsTo(UserDetail, { foreignKey: "user_id" });

// User hasMany Auctions
UserDetail.hasMany(Auction, { foreignKey: "user_id" });

// Auction belongsTo User
Auction.belongsTo(UserDetail, { foreignKey: "user_id" });

//userBidDetailsModel

Item.hasMany(userBidDetailsModel, { foreignKey: "itemId" });
userBidDetailsModel.belongsTo(Item, { foreignKey: "itemId" });

//UserDetail.hasMany(userBidDetailsModel,{foreignKey: "user_id"});

Auction.hasMany(Item, { foreignKey: "auctionId" });
Item.belongsTo(Auction, { foreignKey: "auctionId" });

Auction.hasMany(userBidDetailsModel, { foreignKey: "auctionId" });
userBidDetailsModel.belongsTo(Auction, { foreignKey: "auctionId" });

Item.hasMany(ImageDetailModel, { foreignKey: "itemId" });
ImageDetailModel.belongsTo(Item, { foreignKey: "itemId" });

UserDetail.hasMany(userBidDetailsModel, { foreignKey: "userId" });
userBidDetailsModel.belongsTo(UserDetail, { foreignKey: "userId" });

UserDetail.hasMany(Wishlist, { foreignKey: "user_id" });
Wishlist.belongsTo(UserDetail, { foreignKey: "user_id" });

sequelize
  .sync()
  .then((_) => {
    console.log("Models Loaded");
  })
  .catch((error: Error) => {
    console.log(error);
  });

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
