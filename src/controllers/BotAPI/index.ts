import { Router } from "express";
import endpoints from "./integrations/slack";

const { SLACK_BOT_IN_ENDPOINT = "bot" } = process.env;

const botRouter = Router();

botRouter.use(`/integrations/bot_${SLACK_BOT_IN_ENDPOINT}`, endpoints);

export default botRouter;
