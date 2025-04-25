import request from "supertest";
import express from "express";
import { getFarmer } from "../src/farmer-signup/check-existing";
import pool from "../src/database/db";

jest.mock("../src/database/db", () => ({
  query: jest.fn(),
}));

const app = express();
app.use(express.json()); 
app.use(getFarmer);

describe("POST /get-farmer", () => {
  it("should return farmer ID if email exists", async () => {
    const mockResult = {
      rows: [{ id: 1 }],
    };

    (pool.query as jest.Mock).mockResolvedValue(mockResult);

    const response = await request(app)
      .post("/get-farmer")
      .send({ email: "abdulrafey16504@gmail.com" })
      .set("Content-Type", "application/json")
      .expect(200);

    expect(response.body).toEqual({ id: 1 });
    expect(pool.query).toHaveBeenCalledWith("SELECT id FROM farmers_info WHERE email = $1", [
      "abdulrafey16504@gmail.com",
    ]);
  });

  it("should return 400 if email does not exist", async () => {
    const mockResult = { rows: [] };
    (pool.query as jest.Mock).mockResolvedValue(mockResult);

    const response = await request(app)
      .post("/get-farmer")
      .send({ email: "nonexistent@example.com" })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toEqual({ error: "Not Registered!" });
  });

  it("should return 500 if there's a database error", async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/get-farmer")
      .send({ email: "john.doe@example.com" })
      .set("Content-Type", "application/json")
      .expect(500);

    expect(response.body).toEqual({ error: "Database error" });
  });
});