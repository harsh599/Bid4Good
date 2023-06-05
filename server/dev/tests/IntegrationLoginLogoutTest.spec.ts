import { expect } from "chai";
import "mocha";
import { stub } from "sinon";
import { Request } from "express";
import registerCont from "../controllers/registerCont";

describe("logoutUser", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {
        sessionId: "testSessionId",
      },
      session: {
        id: "testSessionId",
        destroy: stub(),
      },
    } as unknown as Request;
    res = {
      status: stub().returnsThis(),
      json: stub().returnsThis(),
    } as any;
  });

  it("should Throw errror when try to destroy session ", async () => {
    await registerCont.logoutUser(req, res);

    expect(res.json.calledWith({ message: "Session destroyed" })).to.be.false;
  });

  it("should return error message when session destroy fails", async () => {
    const destroyError = new Error("Session destroy failed");
    req.session.destroy = stub().callsArgWith(0, destroyError);

    await registerCont.logoutUser(req, res);

    expect(req.session.destroy.calledOnce).to.be.true;
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "Failed to destroy session" })).to.be
      .true;
  });
});
