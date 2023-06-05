import { expect } from "chai";
import "mocha";
import { stub, SinonStub } from "sinon";
import { Request } from "express";
import { sequelize } from "../util/database";
import detailsCont from "../controllers/fetchDetails";
import { mockReq, mockRes } from "sinon-express-mock";

describe("fetchDetails", () => {
  let req: Request;
  let res: any;
  let sequelizeQueryStub: SinonStub;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    sequelizeQueryStub = stub(sequelize, "query");
  });

  afterEach(() => {
    sequelizeQueryStub.restore();
  });

  it("should fetch details and return them as a JSON response", async () => {
    const expectedDetails = [
      {
        auctionId: 1,
        auctionType: "type",
        startTime: new Date("2023-04-02T10:00:00Z"),
        endTime: new Date("2023-04-02T11:00:00Z"),
        items: [
          {
            itemId: 1,
            itemName: "item 1",
            imageDetails: [
              {
                imgId: 1,
                imgUrl: "http://example.com/img1.jpg",
                imgDescription: "description",
                imgName: "image 1",
              },
            ],
          },
          {
            itemId: 2,
            itemName: "item 2",
            imageDetails: [
              {
                imgId: 2,
                imgUrl: "http://example.com/img2.jpg",
                imgDescription: "description",
                imgName: "image 2",
              },
            ],
          },
        ],
      },
    ];
    sequelizeQueryStub.resolves([
      {
        auctionId: 1,
        auctionType: "type",
        startTime: new Date("2023-04-02T10:00:00Z"),
        endTime: new Date("2023-04-02T11:00:00Z"),
        itemId: 1,
        itemName: "item 1",
        imgId: 1,
        imgUrl: "http://example.com/img1.jpg",
        imgDescription: "description",
        imgName: "image 1",
      },
      {
        auctionId: 1,
        auctionType: "type",
        startTime: new Date("2023-04-02T10:00:00Z"),
        endTime: new Date("2023-04-02T11:00:00Z"),
        itemId: 2,
        itemName: "item 2",
        imgId: 2,
        imgUrl: "http://example.com/img2.jpg",
        imgDescription: "description",
        imgName: "image 2",
      },
    ]);

    await detailsCont.fetchDetails(req, res);

    expect(res.json.calledWith({ details: expectedDetails })).to.be.true;
  });

  it("should handle errors and return a 500 status code", async () => {
    sequelizeQueryStub.rejects(new Error("test error"));

    await detailsCont.fetchDetails(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(
      res.json.calledWith({
        message: "An error occurred while fetching details",
      })
    ).to.be.true;
  });
});
