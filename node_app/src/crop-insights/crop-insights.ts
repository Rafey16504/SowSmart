import express from "express";
import path from "path";
import fs from "fs";
import csv from "csv-parser";

const cropInsightsRouter = express.Router();

interface Entry {
  Year: number;
  Value: number;
}

function linearRegression(
  x: number[],
  y: number[]
): { slope: number; intercept: number } {
  const length = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const slope = (length * sumXY - sumX * sumY) / (length * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / length;
  return { slope, intercept };
}

cropInsightsRouter.get("/crop-insights", (req, res) => {
  const crop = req.query.crop as string;
  const filePath = path.join(
    __dirname,
    "../dataset",
    "FAOSTAT_data_en_4-23-2025.csv"
  );

  if (!crop) {
    res.status(400).json({ error: "Missing crop query parameter" });
    return;
  }

  const entries: Entry[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      if (
        row["Item"] === crop &&
        row["Months"] === "Annual value" &&
        row["Element"] === "Producer Price (LCU/tonne)"
      ) {
        const year = parseInt(row["Year"]);
        const value = parseFloat(row["Value"]);
        if (!isNaN(year) && !isNaN(value)) {
          entries.push({ Year: year, Value: value });
        }
      }
    })
    .on("end", () => {
      const sorted = entries.sort((a, b) => a.Year - b.Year);
      if (sorted.length === 0) {
        return res
          .status(404)
          .json({ error: "No data found for selected crop" });
      }

      const years = sorted.map((d) => d.Year);
      const prices = sorted.map((d) => d.Value);

      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      const volatility = Math.sqrt(
        prices.reduce((sum, val) => sum + (val - avg) ** 2, 0) / prices.length
      );
      const { slope, intercept } = linearRegression(years, prices);

      const nextYears = [
        Math.max(...years) + 1,
        Math.max(...years) + 2,
        Math.max(...years) + 3,
      ];
      const forecasts = nextYears.map((year) =>
        Math.round(slope * year + intercept)
      );

      res.json({
        crop,
        chartData: sorted.map((d) => ({ year: d.Year, value: d.Value })),
        volatility: volatility.toFixed(2),
        forecast3Y: forecasts,
        forecastLabels: nextYears,
      });
    })
    .on("error", (err) => {
      res.status(500).json({ error: "Failed to process CSV file" });
    });
});

cropInsightsRouter.get("/crop-options", (req, res) => {
  const filePath = path.join(
    __dirname,
    "../dataset",
    "FAOSTAT_data_en_4-23-2025.csv"
  );
  const cropSet = new Set<string>();

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      if (
        row["Months"] === "Annual value" &&
        row["Element"] === "Producer Price (LCU/tonne)"
      ) {
        cropSet.add(row["Item"]);
      }
    })
    .on("end", () => {
      res.json({ crops: Array.from(cropSet).sort() });
    })
    .on("error", (err) => {
      res.status(500).json({ error: "Failed to load crop names" });
    });
});

cropInsightsRouter.get("/monthly-top-crops", (req, res) => {
  const month = req.query.month as string;
  const filePath = path.join(
    __dirname,
    "../dataset",
    "FAOSTAT_data_en_4-23-2025.csv"
  );
  const cropTotals: Record<string, number> = {};

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      if (
        row["Months"] === month &&
        row["Element"] === "Producer Price (LCU/tonne)" &&
        row["Item"] &&
        row["Value"]
      ) {
        const value = parseFloat(row["Value"]);
        if (!isNaN(value)) {
          cropTotals[row["Item"]] = (cropTotals[row["Item"]] || 0) + value;
        }
      }
    })
    .on("end", () => {
      const topCrops = Object.entries(cropTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([name, value]) => ({ name, value }));

      res.json({ topCrops });
    })
    .on("error", (err) => {
      res.status(500).json({ error: "Failed to process top crops data" });
    });
});

export { cropInsightsRouter };
