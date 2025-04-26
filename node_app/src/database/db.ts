import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: "postgres.mmvrhkjjttlrhlpnqyqd",
  host: "aws-0-ap-south-1.pooler.supabase.com",
  database: "postgres",
  password: process.env.DB_PASSWORD,
  port: 6543,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect();

export default pool;
