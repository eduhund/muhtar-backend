import { Router } from "express";
import endpoints from "./endpoints";

const { SLACK_BOT_IN_ENDPOINT = "bot" } = process.env;

const botRouter = Router();

botRouter.use(`/${SLACK_BOT_IN_ENDPOINT}`, endpoints);

export default botRouter;
