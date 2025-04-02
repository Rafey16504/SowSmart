const express = require("express");
import {Request, Response } from "express";

export const locationRouter = express.Router();

interface LocationRequest {
    latitude: number;
    longitude: number;
    device?: string;
}

locationRouter.post("/get-location", (req: Request<{}, {}, LocationRequest>, res: Response) => {
    const { latitude, longitude, device } = req.body;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
        return res.status(400).json({ error: "Latitude and longitude must be numbers" });
    }

    console.log(`Received location from ${device || "Unknown Device"}: Lat=${latitude}, Lng=${longitude}`);
    res.json({ message: "Location received successfully!" });
});
