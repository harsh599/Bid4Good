import { expect } from "chai";
import "mocha";
import { stub, SinonStub } from "sinon";
import { Request } from "express";
import { orderDetail } from "../models/orderDetailsModel";
import { Item } from "../models/itemModel";
import orderCont from "../controllers/orderItemCont";
import { mockReq, mockRes } from "sinon-express-mock";

describe("addOrder", () => {
  let req: Request;
  let res: any;
  let orderCreateStub: SinonStub;
  let itemUpdateStub: SinonStub;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    orderCreateStub = stub(orderDetail, "create");
    itemUpdateStub = stub(Item, "update");
  });

  afterEach(() => {
    orderCreateStub.restore();
    itemUpdateStub.restore();
  });

  it("should create a new order and update the item's isSold status", async () => {
    const expectedOrder = { id: 1, buyerId: 123, sellerId: 456, itemId: 789 };
    req.body = { buyerId: 123, sellerId: 456, itemId: 789, isSold: true };
    orderCreateStub.resolves(expectedOrder);

    await orderCont.addOrder(req, res);

    expect(
      orderCreateStub.calledWith({
        buyerId: req.body.buyerId,
        sellerId: req.body.sellerId,
        itemId: req.body.itemId,
      })
    ).to.be.true;

    expect(
      itemUpdateStub.calledWith(
        { isSold: req.body.isSold },
        { where: { itemId: req.body.itemId } }
      )
    ).to.be.true;

    expect(res.status.calledWith(201)).to.be.true;
  });

  it("should handle errors and return a 500 status code", async () => {
    req.body = { buyerId: 123, sellerId: 456, itemId: 789, isSold: true };
    orderCreateStub.rejects(new Error("test error"));

    await orderCont.addOrder(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "test error" })).to.be.false;
  });
});
