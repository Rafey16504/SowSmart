import request from "supertest";
import express from "express";
import { farmerLocation } from "../src/farmer-signup/farmer-location";
import pool from "../src/database/db";

jest.mock("../src/database/db", () => ({
  query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(farmerLocation);

describe("POST /register-location", () => {
  it("should update farmer's location successfully", async () => {
    const mockResult = {
      rows: [
        {
          id: 1,
          province: "Punjab",
          city: "City A",
          district: "District A",
        },
      ],
    };

    (pool.query as jest.Mock).mockResolvedValue(mockResult);

    const response = await request(app)
      .post("/register-location")
      .send({
        farmerId: 1,
        province: "Punjab",
        city: "City A",
        district: "District A",
      })
      .set("Content-Type", "application/json")
      .expect(201);

    expect(response.body).toEqual(mockResult.rows[0]);
    expect(pool.query).toHaveBeenCalledWith(
      "UPDATE farmers_info SET province = $1, city = $2, district = $3 WHERE id = $4 RETURNING *",
      ["Punjab", "City A", "District A", 1]
    );
  });

  it("should return 500 if there's a database error", async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/register-location")
      .send({
        farmerId: 1,
        province: "Province A",
        city: "City A",
        district: "District A",
      })
      .set("Content-Type", "application/json")
      .expect(500);

    expect(response.body).toEqual({ error: "Could not update farmer location." });
  });
});