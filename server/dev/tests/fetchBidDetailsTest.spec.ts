import { expect } from "chai";
import "mocha";
import { stub, SinonStub } from "sinon";
import { Request } from "express";
import { Auction } from "../models/aunctionModel";
import fetchBidDetailsCont from "../controllers/fetchBidDetails";
import { mockReq, mockRes } from "sinon-express-mock";

describe("fetchBidDetails", () => {
  let req: Request;
  let res: any;
  let auctionFindAllStub: SinonStub;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    auctionFindAllStub = stub(Auction, "findAll");
  });

  afterEach(() => {
    auctionFindAllStub.restore();
  });

  it("should fetch details of a specific bid type and return them", async () => {
    const expectedDetails = [{ id: 1, auctionType: "type1", amount: 100 }];
    req.body = { bidType: "type1" };
    auctionFindAllStub.resolves(expectedDetails);

    await fetchBidDetailsCont.fetchBidDetails(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(expectedDetails)).to.be.true;
  });

  it("should fetch details of all bid types and return them", async () => {
    const expectedDetails = [
      { id: 1, auctionType: "type1", amount: 100 },
      { id: 2, auctionType: "type2", amount: 200 },
      { id: 3, auctionType: "type3", amount: 300 },
    ];
    auctionFindAllStub.resolves(expectedDetails);

    await fetchBidDetailsCont.fetchBidDetails(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(expectedDetails)).to.be.true;
  });

  it("should handle errors and return a 500 status code", async () => {
    auctionFindAllStub.rejects(new Error("test error"));

    await fetchBidDetailsCont.fetchBidDetails(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "Server error" })).to.be.true;
  });
});
