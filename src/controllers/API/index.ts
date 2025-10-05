import { Router } from "express";
import { checkUserAuth } from "./security";
import { addTime, getProjects, getTimeList } from "./endpoints";

const apiRouter = Router();

apiRouter.use(checkUserAuth);
apiRouter.get("/getProjects", getProjects);
apiRouter.get("/getTimeList", getTimeList);
apiRouter.post("/addTime", addTime);

export default apiRouter;
