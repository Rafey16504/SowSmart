import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
async function downloadModelIfNeeded() {
  const modelPath = path.resolve(
    __dirname,
    "../../model/plant_disease_prediction_model.h5"
  );

  if (!fs.existsSync(modelPath)) {
    const url = process.env.DISEASEMODEL_URL || "";

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to download model: ${res.statusText}`);
    }

    const totalSize = Number(res.headers.get("content-length"));
    if (!totalSize) {
      console.warn("Could not determine file size, progress won't be shown.");
    }

    fs.mkdirSync(path.dirname(modelPath), { recursive: true });
    const fileStream = fs.createWriteStream(modelPath);

    let downloaded = 0;

    const reader = res.body!.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fileStream.write(value);
      downloaded += value.length;

      if (totalSize) {
        const percent = ((downloaded / totalSize) * 100).toFixed(2);
        process.stdout.write(`\rDownloading model... ${percent}%`);
      }
    }

    fileStream.close();
  }
}

export default downloadModelIfNeeded;
