import { Router } from "express";
import { getProjects, getTimeList } from "./endpoints";
import membershipApiRouter from "./MembershipAPI";

const apiRouter = Router();

apiRouter.use("/membership", membershipApiRouter);

export default apiRouter;
