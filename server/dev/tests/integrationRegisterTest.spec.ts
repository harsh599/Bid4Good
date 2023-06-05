import { expect } from "chai";
import "mocha";
import { stub, SinonStub } from "sinon";
import { Request } from "express";
import { UserDetail } from "../models/userDetailModel";
import registerCont from "../controllers/registerCont";

describe("showUser", () => {
  let req: any;
  let res: any;
  let findAllStub: SinonStub;

  beforeEach(() => {
    req = {} as Request;
    res = {
      send: stub().returnsThis(),
      status: stub().returnsThis(),
    } as any;
    findAllStub = stub(UserDetail, "findAll");
  });

  afterEach(() => {
    findAllStub.restore();
  });

  it("should fetch and send user details", async () => {
    const expectedResult = [
      {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        isSeller: false,
        isBuyer: true,
        govtIdUrl: "http://example.com/govt-id",
        phone: "1234567890",
        address: "123 Main St",
        cityName: "Anytown",
        provinceName: "Anystate",
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        dateOfBirth: "1995-01-01",
        isSeller: true,
        isBuyer: false,
        govtIdUrl: "http://example.com/govt-id-2",
        phone: "0987654321",
        address: "456 Oak St",
        cityName: "Anytown",
        provinceName: "Anystate",
      },
    ];
    findAllStub.resolves(expectedResult);

    await registerCont.showUser(req, res);

    expect(res.send.calledWith(expectedResult)).to.be.true;
    expect(findAllStub.calledOnce).to.be.true;
  });

  it("should return an empty array if no user details are found", async () => {
    const expectedResult: any[] = [];
    findAllStub.resolves(expectedResult);

    await registerCont.showUser(req, res);

    expect(res.send.calledWith(expectedResult)).to.be.true;
    expect(findAllStub.calledOnce).to.be.true;
  });

  it("should return an Error when array of user objects sorted by last name", async () => {
    const result = [
      {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        isSeller: true,
        isBuyer: false,
        govtIdUrl: "http://example.com/govt-id",
        phone: "1234567890",
        address: "123 Main St",
        cityName: "Anytown",
        provinceName: "Anystate",
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        dateOfBirth: "1992-01-01",
        isSeller: false,
        isBuyer: true,
        govtIdUrl: "http://example.com/govt-id",
        phone: "1234567890",
        address: "123 Main St",
        cityName: "Anytown",
        provinceName: "Anystate",
      },
    ];
    const sortedResult = [
      {
        firstName: "Jane",
        lastName: "Doe",
        dateOfBirth: "1992-01-01",
        isSeller: false,
        isBuyer: true,
        govtIdUrl: "http://example.com/govt-id",
        phone: "1234567890",
        address: "123 Main St",
        cityName: "Anytown",
        provinceName: "Anystate",
      },
      {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        isSeller: true,
        isBuyer: false,
        govtIdUrl: "http://example.com/govt-id",
        phone: "1234567890",
        address: "123 Main St",
        cityName: "Anytown",
        provinceName: "Anystate",
      },
    ];
    findAllStub.resolves(result);

    await registerCont.showUser(req, res);

    expect(res.send.calledWith(sortedResult)).to.be.false;
  });
});
