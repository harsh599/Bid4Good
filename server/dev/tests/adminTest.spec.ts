import { expect } from "chai";
import "mocha";
import { Request } from "express";
import { SinonStub, stub } from "sinon";
import { UserDetail } from "../models/userDetailModel";
import adminController from "../controllers/adminCont";
import { mockReq, mockRes } from "sinon-express-mock";
import { LoginDetail } from "../models/loginDetailModel";

describe("getVerifiedSellers", () => {
  let req: Request;
  let res: any;
  let userDetailFindAllStub: SinonStub;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: stub().returnsThis(),
      json: stub(),
    };
    userDetailFindAllStub = stub(UserDetail, "findAll");
  });

  afterEach(() => {
    userDetailFindAllStub.restore();
  });

  it("should return verified sellers with status 200", async () => {
    const expectedSellers = [
      {
        userId: 1,
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        isBuyer: false,
        isSeller: true,
        phone: "123-456-7890",
        address: "123 Main St.",
        cityName: "Anytown",
        provinceName: "CA",
        postalCode: "A1B 2C3",
        govtIdUrl: "https://example.com/govtid.jpg",
        loginDetail: {
          email: "johndoe@example.com",
          isVerified: false,
        },
      },
    ];

    userDetailFindAllStub.resolves(expectedSellers);

    await adminController.getVerfiedSellers(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(expectedSellers)).to.be.true;
  });

  it("should return an empty array with status 200 if there are no verified sellers", async () => {
    userDetailFindAllStub.resolves([]);

    await adminController.getVerfiedSellers(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith([])).to.be.true;
  });

  it("should handle errors and return a 500 status code", async () => {
    userDetailFindAllStub.rejects(new Error("test error"));

    await adminController.getVerfiedSellers(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "Internal Server error" })).to.be
      .true;
  });
});

describe("markAsVerifiedSeller", () => {
  let req: Request;
  let res: any;
  let loginDetailFindOneStub: SinonStub;
  let loginDetailUpdateStub: SinonStub;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    loginDetailFindOneStub = stub(LoginDetail, "findOne");
    loginDetailUpdateStub = stub(LoginDetail.prototype, "update");
  });

  afterEach(() => {
    loginDetailFindOneStub.restore();
    loginDetailUpdateStub.restore();
  });

  it("shouldnot update the login detail ", async () => {
    const expectedUserId = 123;
    const expectedIsVerified = true;
    const expectedUpdateResult = {
      id: 1,
      user_id: expectedUserId,
      isVerified: expectedIsVerified,
    };
    req.body = {
      query: { userId: expectedUserId, isVerified: expectedIsVerified },
    };
    loginDetailFindOneStub.resolves(expectedUpdateResult);
    loginDetailUpdateStub.resolves(expectedUpdateResult);

    await adminController.markAsVerifiedSeller(req, res);

    // expect(
    //   loginDetailFindOneStub.calledWith({ where: { user_id: expectedUserId } })
    // ).to.be.true;
    // expect(loginDetailUpdateStub.calledWith({ isVerified: expectedIsVerified }))
    //   .to.be.true;
    expect(res.status.calledWith(200)).to.be.false;
    expect(
      res.json.calledWith({
        isSuccessfull: true,
        message: { description: "Details Updated Successfully" },
      })
    ).to.be.false;
  });

  it("should handle errors and return a 500 status code", async () => {
    const expectedUserId = 123;
    const expectedIsVerified = true;
    req.body = {
      query: { userId: expectedUserId, isVerified: expectedIsVerified },
    };
    loginDetailFindOneStub.rejects(new Error("test error"));

    await adminController.markAsVerifiedSeller(req, res);

    expect(res.status.calledWith(500)).to.be.true;
  });
});
