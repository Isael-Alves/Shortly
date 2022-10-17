import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
const connectDatabase = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.MODE === "PROD") {
    connectDatabase.ssl = {
    rejectUnauthorized: false,
  };
}

const db = new Pool(connectDatabase);
export default db;
