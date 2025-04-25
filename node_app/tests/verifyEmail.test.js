const request = require("supertest");
const nodemailer = require("nodemailer");
const { verifyEmail } = require("../src/farmer-signup/send-email");

jest.mock("nodemailer");

describe("POST /send-email", () => {
  it("should send a verification code successfully", async () => {
    const mockTransporter = {
      sendMail: jest.fn().mockResolvedValue(true),
    };

    nodemailer.createTransport.mockReturnValue(mockTransporter);

    const response = await request(verifyEmail)
      .post("/send-email")
      .send({ email: "john.doe@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/^\d{6}$/); // Verify code is a 6-digit number
    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: "sowsmartss@gmail.com",
      to: "john.doe@example.com",
      subject: "Verification Code",
      text: expect.any(String),
    });
  });

  it("should return 500 if email sending fails", async () => {
    const mockTransporter = {
      sendMail: jest.fn().mockRejectedValue(new Error("Email error")),
    };

    nodemailer.createTransport.mockReturnValue(mockTransporter);

    const response = await request(verifyEmail)
      .post("/send-email")
      .send({ email: "john.doe@example.com" });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Could not send email!");
  });
});