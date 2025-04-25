import request from "supertest";
import express from "express";
import { farmerRegister } from "../src/farmer-signup/farmer-register";
import pool from "../src/database/db";
import bcrypt from "bcrypt";

// Mock the database module
jest.mock("../src/database/db", () => ({
  query: jest.fn(),
}));

// Mock bcrypt.hash
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
}));

// Create an Express app and mount the router
const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(farmerRegister);

describe("POST /register-farmer", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  afterAll(() => {
    jest.restoreAllMocks(); // Restore all original implementations
  });

  it("should register a new farmer successfully", async () => {
    const mockResult = {
      rows: [{ id: 1 }],
    };

    (pool.query as jest.Mock).mockResolvedValue(mockResult);

    const response = await request(app)
      .post("/register-farmer")
      .send({
        name: "John Doe",
        gender: "Male",
        dateOfBirth: "1990-01-01",
        phoneNumber: "1234567890", // Valid 10-digit phone number
        email: "john.doe@example.com",
        password: "password123",
        province: "Province A",
        city: "City A",
        district: "District A",
      })
      .set("Content-Type", "application/json")
      .expect(201);

    expect(response.body).toEqual({ success: true, farmerId: 1 });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);

    // Normalize the expected query string
    const expectedQuery = `
      INSERT INTO farmers_info 
        (name, gender, dob, phone_number, email, password, province, city, district) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `.replace(/\s+/g, " ").trim(); // Normalize whitespace

    expect(pool.query).toHaveBeenCalledWith(
      expectedQuery,
      [
        "John Doe",
        "Male",
        "1990-01-01",
        "1234567890", // Valid 10-digit phone number
        "john.doe@example.com",
        "hashedPassword",
        "Province A",
        "City A",
        "District A",
      ]
    );
  });

  it("should return 500 if there's a database error", async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error("Registration failed."));

    const response = await request(app)
      .post("/register-farmer")
      .send({
        name: "John Doe",
        gender: "Male",
        dateOfBirth: "1990-01-01",
        phoneNumber: "1234567890",
        email: "john.doe@example.com",
        password: "password123",
        province: "Province A",
        city: "City A",
        district: "District A",
      })
      .set("Content-Type", "application/json")
      .expect(500);

    expect(response.body).toEqual({ error: "Registration failed." });
  });

  
});