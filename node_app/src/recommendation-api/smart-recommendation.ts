import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import csv from "csv-parser";

export const smartRecommend = express.Router();

interface CropData {
  Item: string;
  Year: number;
  Value: number;
}

const monthToSeason = (month: string): "Rabi" | "Kharif" | null => {
  const rabiMonths = ["November", "December", "January", "February", "March"];
  const kharifMonths = ["June", "July", "August", "September", "October"];
  if (rabiMonths.includes(month)) return "Rabi";
  if (kharifMonths.includes(month)) return "Kharif";
  return null;
};

const cropRegions: Record<string, string> = {
  "Wheat": "Punjab",
  "Rice": "Sindh",
  "Maize (corn)": "Punjab",
  "Barley": "Sindh",
  "Lentils, dry": "Sindh",
  "Cotton lint, ginned": "Punjab",
  "Chillies and peppers, dry (Capsicum spp., Pimenta spp.), raw": "Sindh",
  "Bananas": "KP",
  "Dates": "Balochistan",
  "Groundnuts, excluding shelled": "Punjab"
};

smartRecommend.get("/smart-recommendation", async (req: Request, res: Response) => {
  const { season, region } = req.query;
  const dataPath = path.join(__dirname, "../dataset", "FAOSTAT_data_en_4-23-2025.csv");
  const results: CropData[] = [];

  fs.createReadStream(dataPath)
    .pipe(csv())
    .on("data", (row: Record<string, string>) => {
      const item = row["Item"];
      const month = row["Months"];
      const year = parseInt(row["Year"]);
      const value = parseFloat(row["Value"]);
      const derivedSeason = monthToSeason(month);

      if (!isNaN(year) && !isNaN(value) && derivedSeason) {
        if (
          cropRegions[item] &&
          derivedSeason === season &&
          cropRegions[item] === region
        ) {
          results.push({ Item: item, Year: year, Value: value });
        }
      }
    })
    .on("end", () => {
      const grouped: Record<string, CropData[]> = {};
      for (const entry of results) {
        if (!grouped[entry.Item]) grouped[entry.Item] = [];
        grouped[entry.Item].push(entry);
      }

      const final = Object.entries(grouped)
        .map(([crop, data]) => {
          const sorted = data.sort((a, b) => a.Year - b.Year);
          const recent = sorted.slice(-2);
          if (recent.length < 2) return null;

          const growth = ((recent[1].Value - recent[0].Value) / recent[0].Value) * 100;

          return {
            crop,
            currentPrice: recent[1].Value.toFixed(0),
            predictedPrice: (recent[1].Value * (1 + growth / 100)).toFixed(0),
            growth: growth.toFixed(2),
            suggestion: growth > 5 ? "Plant" : "Avoid"
          };
        })
        .filter(Boolean);

      res.json(final);
    })
    .on("error", (err) => {
      console.error("CSV parsing error:", err);
      res.status(500).json({ error: "Internal server error while processing CSV" });
    });
});
