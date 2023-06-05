import { expect } from "chai";
import bcrypt from "bcrypt";
import { checkPassword, hashPassword } from "../util/passwordHashing";

describe("checkPassword", () => {
  it("should return true if the password matches the hashed password", async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const passwordMatches = await checkPassword(password, hashedPassword);

    expect(passwordMatches).to.be.true;
  });

  it("should return false if the password does not match the hashed password", async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash("differentPassword", 10);

    const passwordMatches = await checkPassword(password, hashedPassword);

    expect(passwordMatches).to.be.false;
  });
});

describe("hashPassword", () => {
  it("should return a string of length 60", async () => {
    const password = "testpassword";
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).to.be.a("string").and.have.lengthOf(60);
  });
});

describe("checkPassword", () => {
  it("should return true for matching passwords", async () => {
    const password = "testpassword";
    const hashedPassword = await hashPassword(password);
    const passwordMatches = await checkPassword(password, hashedPassword);
    expect(passwordMatches).to.be.true;
  });

  it("should return false for non-matching passwords", async () => {
    const password = "testpassword";
    const otherPassword = "differentpassword";
    const hashedPassword = await hashPassword(password);
    const passwordMatches = await checkPassword(otherPassword, hashedPassword);
    expect(passwordMatches).to.be.false;
  });
});
