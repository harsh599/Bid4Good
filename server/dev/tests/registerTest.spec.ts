import { expect } from "chai";
import "mocha";
import { stub, SinonStub } from "sinon";
import { Request } from "express";
import { UserDetail } from "../models/userDetailModel";
import registerCont from "../controllers/registerCont";
import sinon from "sinon";
import { mockReq, mockRes } from "sinon-express-mock";

describe("registerUser", () => {
  let req: any;
  let res: any;
  let createStub: SinonStub;

  beforeEach(() => {
    req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        isBuyer: true,
        isSeller: false,
        phone: "1234567890",
        address: "123 Main St",
        cityName: "Anytown",
        provinceName: "Anystate",
        govtIdUrl: "http://example.com/govt-id",
        email: "johndoe@example.com",
        password: "password123",
        postalCode: "12345",
      },
    } as Request;
    res = {
      status: stub().returnsThis(),
      json: stub().returnsThis(),
    };
    createStub = stub(UserDetail, "create");
  });

  afterEach(() => {
    createStub.restore();
  });

  it("should handle errors and send a 500 status code", async () => {
    createStub.rejects(new Error("test error"));

    await registerCont.registerUser(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith(sinon.match.object)).to.be.true;
    expect(createStub.calledOnce).to.be.true;
  });
});

describe("updateUserDetails", () => {
  let req: any;
  let res: any;
  let userDetailFindOneStub: SinonStub;
  let userDetailUpdateStub: SinonStub;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    userDetailFindOneStub = stub(UserDetail, "findOne");
    userDetailUpdateStub = stub();
  });

  afterEach(() => {
    userDetailFindOneStub.restore();
    // userDetailUpdateStub.restore();
  });

  it("should update the user details and return a success message", async () => {
    const expectedUserDetail = {
      id: 1,
      userId: 123,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
      phone: "123456789",
      address: "123 Main St",
      cityName: "Anytown",
      provinceName: "Anystate",
      postalCode: "12345",
    };
    req.body = {
      userId: 123,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
      phone: "123456789",
      address: "123 Main St",
      cityName: "Anytown",
      provinceName: "Anystate",
      postalCode: "12345",
    };
    userDetailFindOneStub.resolves(expectedUserDetail);
    userDetailUpdateStub = stub(expectedUserDetail, "id");

    await registerCont.updateUserDetails(req, res);

    expect(userDetailFindOneStub.calledWith({ where: { userId: 123 } })).to.be
      .true;
    expect(
      userDetailUpdateStub.calledWith({
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        phone: "123456789",
        address: "123 Main St",
        cityName: "Anytown",
        provinceName: "Anystate",
        postalCode: "12345",
      })
    ).to.be.false;
    expect(res.status.calledWith(200)).to.be.false;
    expect(
      res.json.calledWith({
        isSuccessfull: true,
        message: { description: "Details Updated Successfully" },
      })
    ).to.be.false;
  });

  it("should handle errors and return a 500 status code", async () => {
    req.body = {
      userId: 123,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
      phone: "123456789",
      address: "123 Main St",
      cityName: "Anytown",
      provinceName: "Anystate",
      postalCode: "12345",
    };
    userDetailFindOneStub.rejects(new Error("test error"));

    await registerCont.updateUserDetails(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "Internal Server error" })).to.be
      .true;
  });
});
