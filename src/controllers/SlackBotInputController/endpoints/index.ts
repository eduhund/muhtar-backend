import { Router } from "express";

import addTime from "./addTime";
import { checkBot } from "../security";
import { checkActor } from "../actor";

const router = Router();
router.use(checkBot);
router.use(checkActor);
router.use("/addTime", addTime);

export default router;
