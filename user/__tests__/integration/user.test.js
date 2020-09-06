const request = require("supertest");

const app = require("../../src/app");

const truncate = require("../utils/truncate");
const factory = require("../factories");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should create user", async () => {
    const user = await factory.attrs("User");

    const response = await request(app).post("/users").send(user);

    expect(response.status).toBe(200);
  });
});
