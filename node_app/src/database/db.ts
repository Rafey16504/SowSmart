import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "SowSmart",
  password: "12345_qwert",
  port: 5432,
});

pool
  .connect()

export default pool;
