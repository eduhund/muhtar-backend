import { Router } from "express";
import { checkUserAuth } from "./security";
import { addTime, getTeamProjects } from "./endpoints";

const apiRouter = Router();

apiRouter.use(checkUserAuth);
apiRouter.get("/getTeamProjects", getTeamProjects);
apiRouter.post("/addTime", addTime);

export default apiRouter;
