import { expect } from "chai";
import "mocha";
// import { Request } from "express";
import sinon, { SinonStub } from "sinon";
import { addBidItems } from "../controllers/addBidItems";
import { Auction } from "../models/aunctionModel";
import { Item } from "../models/itemModel";
import { ImageDetailModel } from "../models/imageDetails";
import { mockReq, mockRes } from "sinon-express-mock";

describe("addBidItems", () => {
  let req: any;
  let res: any;
  let auctionCreateStub: SinonStub;
  let itemCreateStub: SinonStub;
  let imageDetailCreateStub: SinonStub;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    auctionCreateStub = sinon.stub(Auction, "create");
    itemCreateStub = sinon.stub(Item, "create");
    imageDetailCreateStub = sinon.stub(ImageDetailModel, "create");
  });

  afterEach(() => {
    auctionCreateStub.restore();
    itemCreateStub.restore();
    imageDetailCreateStub.restore();
  });

  it("should create a new bid item and return it", async () => {
    const expectedAuction = {
      auctionId: 1,
      startTime: new Date(),
      endTime: new Date(),
      auctionType: "type",
      address: "123 Main St",
      cityName: "City",
      provinceName: "Province",
      postalCode: "A1B 2C3",
      user_id: 123,
    };
    const expectedItem = {
      itemId: 2,
      itemName: "Item",
      itemDes: "Description",
      isSold: false,
      user_id: 123,
      startPrice: 10.99,
      auctionId: 1,
    };
    const expectedImageDetails = [
      {
        imageDetailId: 3,
        imgDescription: "Description",
        imgName: "Name",
        imgUrl: "https://example.com/image.jpg",
        itemId: 2,
      },
    ];
    req.body = {
      itemName: "Item",
      itemDes: "Description",
      startPrice: 10.99,
      startTime: new Date(),
      endTime: new Date(),
      auctionType: "type",
      isSold: false,
      address: "123 Main St",
      cityName: "City",
      provinceName: "Province",
      postalCode: "A1B 2C3",
      imageDetails: [
        {
          imgDescription: "Description",
          imgName: "Name",
          imgUrl: "https://example.com/image.jpg",
        },
      ],
      userId: 123,
    };
    auctionCreateStub.resolves({
      getDataValue: () => expectedAuction.auctionId,
      get: () => expectedAuction,
    });
    itemCreateStub.resolves({
      getDataValue: () => expectedItem.itemId,
      get: () => expectedItem,
    });
    imageDetailCreateStub.resolves({
      get: () => expectedImageDetails[0],
    });

    await addBidItems(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ message: { itemDetail: expectedItem } }))
      .to.be.true;
    expect(
      res.json.calledWithMatch({ message: { auctionDetail: expectedAuction } })
    ).to.be.true;
    expect(
      res.json.calledWithMatch({
        message: { imageDetailsPlain: expectedImageDetails },
      })
    ).to.be.true;
  });

  it("should return a 500 error response if there is an error creating an auction", async () => {
    req.body = {
      itemName: "testItem",
      itemDes: "test description",
      startPrice: 10,
      startTime: "2023-04-02 08:00:00",
      endTime: "2023-04-03 08:00:00",
      auctionType: "test auction",
      isSold: false,
      address: "test address",
      cityName: "test city",
      provinceName: "test province",
      postalCode: "test postal code",
      imageDetails: [],
      userId: 1,
    };
    const auctionError = new Error("test auction error");
    auctionCreateStub.rejects(auctionError);

    await addBidItems(req, res);

    expect(res.status.calledWith(500)).to.be.true;
  });
});
