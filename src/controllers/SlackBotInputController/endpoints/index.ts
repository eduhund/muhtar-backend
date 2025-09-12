import { Router } from "express";

import addTime from "./addTime";
import { checkBot } from "../security";

const router = Router();
router.use(checkBot);
router.use("/addTime", addTime);

export default router;
