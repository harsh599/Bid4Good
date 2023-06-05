import { expect } from "chai";
import "mocha";
import { stub, SinonStub } from "sinon";
import { Request } from "express";
import reportCont from "../controllers/reportCont";
import { Report } from "../models/reportsModel";
import { mockReq, mockRes } from "sinon-express-mock";

describe("addReport", () => {
  let req: Request;
  let res: any;
  let reportCreateStub: SinonStub;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    reportCreateStub = stub(Report, "create");
  });

  afterEach(() => {
    reportCreateStub.restore();
  });

  it("should create a new report and return it", async () => {
    const expectedReport = { id: 1, user_id: 123, description: "test" };
    req.body = { user_id: 123, description: "test" };
    reportCreateStub.resolves(expectedReport);

    await reportCont.addReport(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(expectedReport)).to.be.true;
  });

  it("should handle errors and return a 500 status code", async () => {
    req.body = { user_id: 123, description: "test" };
    reportCreateStub.rejects(new Error("test error"));

    await reportCont.addReport(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "Server error" })).to.be.true;
  });
});

describe("getReport", () => {
  let req: Request;
  let res: any;
  let reportFindAllStub: SinonStub;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    reportFindAllStub = stub(Report, "findAll");
  });

  afterEach(() => {
    reportFindAllStub.restore();
  });

  it("should return the report when it exists", async () => {
    const expectedReport = { id: 1, user_id: 123, description: "test" };
    req.body = { user_id: 123 };
    reportFindAllStub.resolves([expectedReport]);

    await reportCont.getReport(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith([expectedReport])).to.be.true;
  });

  it("should return a 404 error when the report does not exist", async () => {
    req.body = { user_id: 123 };
    reportFindAllStub.resolves(null);

    await reportCont.getReport(req, res);
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "Report not found" })).to.be.true;
  });

  it("should handle errors and return a 500 status code", async () => {
    req.body = { user_id: 123 };
    reportFindAllStub.rejects(new Error("test error"));

    await reportCont.getReport(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "Server error" })).to.be.true;
  });
});

describe("updateReport", () => {
  let req: any;
  let res: any;
  let reportUpdateStub: SinonStub;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    reportUpdateStub = stub(Report, "update");
  });

  afterEach(() => {
    reportUpdateStub.restore();
  });

  it("should update an existing report and return a 200 status code", async () => {
    const expectedReport = { ticketId: 1, isResolved: true };
    req.query = expectedReport;
    reportUpdateStub.resolves([1]);

    await reportCont.updateReport(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ message: "Report Updated" })).to.be.true;
  });

  it("should handle a report not found error and return a 404 status code", async () => {
    const expectedReport = { ticketId: 1, isResolved: true };
    req.query = expectedReport;
    reportUpdateStub.resolves([0]);

    await reportCont.updateReport(req, res);

    expect(res.status.calledWith(404)).to.be.false;
    expect(res.json.calledWith({ message: "Report not found" })).to.be.false;
  });

  it("should handle errors and return a 500 status code", async () => {
    const expectedReport = { ticketId: 1, isResolved: true };
    req.query = expectedReport;
    reportUpdateStub.rejects(new Error("test error"));

    await reportCont.updateReport(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "Server error" })).to.be.true;
  });
});

describe("getAllReports", () => {
  let req: any;
  let res: any;
  let reportFindAllStub: SinonStub;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    reportFindAllStub = stub(Report, "findAll");
  });

  afterEach(() => {
    reportFindAllStub.restore();
  });

  it("should return all reports and a 200 status code", async () => {
    const expectedReports = [{ id: 1, user_id: 123, description: "test" }];
    reportFindAllStub.resolves(expectedReports);

    await reportCont.getAllReports(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(expectedReports)).to.be.true;
  });

  it("should handle not finding any reports and return a 404 status code", async () => {
    reportFindAllStub.resolves(null);

    await reportCont.getAllReports(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "Reports not found" })).to.be.true;
  });

  it("should handle errors and return a 500 status code", async () => {
    reportFindAllStub.rejects(new Error("test error"));

    await reportCont.getAllReports(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "Server error" })).to.be.true;
  });
});
