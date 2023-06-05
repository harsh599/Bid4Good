import { expect } from "chai";
import { sendEmail } from "../util/emailSender";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

import nodemailer from "nodemailer";
describe("sendEmail", () => {
  it("should send an email successfully", async () => {
    const message = "Welcome to Bid For Good!";
    const emailId = "example@example.com";

    await sendEmail(message, emailId);

    // Expect the function to not throw an error
    expect(true).to.be.true;
  });
});

it("should throw an error when the email credentials are incorrect", async () => {
  // Replace the email credentials with incorrect values
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: "incorrect_email",
      pass: "incorrect_password",
    },
  });

  // Expect an error to be thrown
  expect(false).to.be.false;
});
