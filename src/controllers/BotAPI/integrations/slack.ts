import { Router } from "express";

import addTime from "../../endpoints/addTime";
import { checkBot, checkActor } from "../middlewares";

const router = Router();
router.use(checkBot);
router.use(checkActor);
router.use("/addTime", addTime);

export default router;
