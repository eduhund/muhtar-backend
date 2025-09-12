import express from "express";
import cors from "cors";
import log from "../../utils/log";
import apiRouter from "../../controllers/API";
import { handlePath } from "./utils";

const { SERVER_PORT = 8081 } = process.env;

const server = express();

server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(apiRouter);

server.use(handlePath);

async function start() {
  return new Promise<void>((resolve, reject) => {
    try {
      server.listen(SERVER_PORT, () => {
        log.info("Server starts on port", SERVER_PORT);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

export default { server, start };
