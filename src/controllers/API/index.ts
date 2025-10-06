import { Router } from "express";
import { getProjects, getTimeList } from "./endpoints";

const apiRouter = Router();

apiRouter.get("/getProjects", getProjects);
apiRouter.get("/getTimeList", getTimeList);

export default apiRouter;
