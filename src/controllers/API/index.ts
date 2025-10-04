import { Router } from "express";
import { checkUserAuth } from "./security";
import { addTime } from "./endpoints";

const apiRouter = Router();

apiRouter.use(checkUserAuth);
apiRouter.post("/addTime", addTime);

export default apiRouter;
