import { expect } from "chai";
import "mocha";
import { stub, SinonStub } from "sinon";
import { Request } from "express";
import { userBidDetailsModel } from "../models/userBidDetails";
import bidCont from "../controllers/placeBid";
import { mockReq, mockRes } from "sinon-express-mock";

describe("placeBid", () => {
  let req: Request;
  let res: any;
  let userBidDetailsCreateStub: SinonStub;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    userBidDetailsCreateStub = stub(userBidDetailsModel, "create");
  });

  afterEach(() => {
    userBidDetailsCreateStub.restore();
  });

  it("should create a new bid and return it", async () => {
    const expectedBid = {
      id: 1,
      itemId: 123,
      bidAmount: 50,
      auctionId: 456,
      userId: 789,
    };
    req.body = { itemId: 123, bidAmount: 50, auctionId: 456, userId: 789 };
    userBidDetailsCreateStub.resolves(expectedBid);

    await bidCont.placeBid(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(expectedBid)).to.be.true;
  });

  it("should handle errors and return a 500 status code", async () => {
    req.body = { itemId: 123, bidAmount: 50, auctionId: 456, userId: 789 };
    userBidDetailsCreateStub.rejects(new Error("test error"));

    await bidCont.placeBid(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "Server error" })).to.be.true;
  });
});
