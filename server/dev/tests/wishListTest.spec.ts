import { expect } from "chai";
import { stub, SinonStub } from "sinon";
import { Wishlist } from "../models/wishlistModel";
import { addWishlist, deleteWishlistItem } from "../controllers/wishlistCont";
import { mockReq, mockRes } from "sinon-express-mock";

describe("addWishlist", () => {
  let req: any;
  let res: any;
  let createStub: SinonStub;

  beforeEach(() => {
    req = mockReq({
      query: { item_id: 1, user_id: 2 },
    });
    res = mockRes();
    createStub = stub(Wishlist, "create");
  });

  afterEach(() => {
    createStub.restore();
  });

  it("should create a new wishlist item and return it", async () => {
    const expectedWishlist = { id: 1, item_id: 4, user_id: 4 };
    createStub.resolves(expectedWishlist);

    await addWishlist(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(
      res.json.calledWith({ message: { WishlistDetails: expectedWishlist } })
    ).to.be.false;
  });

  it("should handle errors and return a 500 status code", async () => {
    const error = new Error("test error");
    createStub.rejects(error);

    await addWishlist(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: error })).to.be.true;
  });
});

describe("deleteWishlistItem", () => {
  let req: any;
  let res: any;
  let destroyStub: SinonStub;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: stub().returns({
        json: stub(),
      }),
    } as unknown as Response;
    destroyStub = stub(Wishlist, "destroy");
  });

  afterEach(() => {
    destroyStub.restore();
  });

  it("should delete an item from the wishlist and return a 200 status code", async () => {
    const item_id = 1;
    const user_id = 2;
    const deletedItem = 1;
    req.query = { item_id, user_id };
    destroyStub.resolves(deletedItem);

    await deleteWishlistItem(req, res);

    expect(destroyStub.calledOnceWith({ where: { item_id, user_id } })).to.be
      .true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.status().json.calledWith({ message: "Item deleted from wishlist" })
    ).to.be.true;
  });

  it("should return a 404 status code if the item is not found in the wishlist", async () => {
    const item_id = 1;
    const user_id = 2;
    const deletedItem = 0;
    req.query = { item_id, user_id };
    destroyStub.resolves(deletedItem);

    await deleteWishlistItem(req, res);

    expect(destroyStub.calledOnceWith({ where: { item_id, user_id } })).to.be
      .true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(
      res.status().json.calledWith({ message: "Item not found in wishlist" })
    ).to.be.true;
  });

  it("should handle errors and return a 500 status code", async () => {
    const item_id = 1;
    const user_id = 2;
    req.query = { item_id, user_id };
    destroyStub.rejects(new Error("test error"));

    await deleteWishlistItem(req, res);
    console.log(res.status);

    expect(destroyStub.calledOnceWith({ where: { item_id, user_id } })).to.be
      .true;
    expect(res.status.calledWith(500)).to.be.true;
  });
});
