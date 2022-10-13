import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
const connectDatabase = {
  connectionString: process.env.DATABASE_URL,
};

//Quando for fazer o deploy no heroku configurar Vars o MODE para PROD
if (process.env.MODE === "PROD") {
    connectDatabase.ssl = {
    rejectUnauthorized: false,
  };
}

const db = new Pool(connectDatabase);
export default db;
