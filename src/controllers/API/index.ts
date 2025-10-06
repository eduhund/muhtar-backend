import { Router } from "express";
import membershipApiRouter from "./MembershipAPI";

const apiRouter = Router();

apiRouter.use("/membership", membershipApiRouter);

export default apiRouter;
