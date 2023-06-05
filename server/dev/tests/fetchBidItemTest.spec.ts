import { expect } from "chai";
import "mocha";
import { stub, SinonStub } from "sinon";
import { Request } from "express";
import { Item } from "../models/itemModel";
import itemController from "../controllers/fetchBidItems";
import { mockReq, mockRes } from "sinon-express-mock";

describe("fetchBidItems", () => {
  let req: Request;
  let res: any;
  let itemFindAllStub: SinonStub;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    itemFindAllStub = stub(Item, "findAll");
  });

  afterEach(() => {
    itemFindAllStub.restore();
  });

  it("should fetch and return all items in ascending order by item name", async () => {
    const expectedItems = [
      { id: 1, itemName: "Apple", bidPrice: 2.5 },
      { id: 2, itemName: "Banana", bidPrice: 1.5 },
    ];
    itemFindAllStub.resolves(expectedItems);

    await itemController.fetchBidItems(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(expectedItems)).to.be.true;
    expect(
      itemFindAllStub.calledOnceWithExactly({ order: [["itemName", "ASC"]] })
    ).to.be.true;
  });

  it("should handle errors and return a 500 status code", async () => {
    itemFindAllStub.rejects(new Error("test error"));

    await itemController.fetchBidItems(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "Server error" })).to.be.true;
  });
});
