import express, { json } from "express";
import cors from "cors";
import router from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();

const server = express();

server.use(json());
server.use(cors());
server.use(router);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server listen running on port: ${PORT}`);
});
