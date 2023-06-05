import { expect } from "chai";
import "mocha";
import { stub } from "sinon";
import { Request } from "express";
// import { sequelize } from "../../util/database";
// import { Auction } from "../../models/aunctionModel";
// import { ImageDetailModel } from "../../models/imageDetails";
// import { Item } from "../../models/itemModel";
// import { userBidDetailsModel } from "../../models/userBidDetails";
// import { QueryTypes } from "sequelize";
// import { UserDetail } from "../../models/userDetailModel";
import { mockReq, mockRes } from "sinon-express-mock";
import auctionHandler from "../controllers/liveAuctionController/auctionHandler";

describe("auctionController", () => {
  let req: Request;
  let res: any;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe("makeBid", () => {
    it("should console log 'Bid hit'", () => {
      const consoleStub = stub(console, "log");
      auctionHandler.makeBid(req, res);
      expect(consoleStub.calledWith("Bid hit")).to.be.true;
      consoleStub.restore();
    });
  });

  describe("showCurrentAuctions", () => {
    it("should console log 'fetch Auction list'", () => {
      const consoleStub = stub(console, "log");
      auctionHandler.showCurrentAuctions(req, res);
      expect(consoleStub.calledWith("fetch Auction list")).to.be.true;
      consoleStub.restore();
    });
  });
});
