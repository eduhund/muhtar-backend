import { Router } from "express";
import authApiRouter from "./AuthAPI";
import membershipApiRouter from "./MembershipAPI";

const apiRouter = Router();

apiRouter.use("/auth", authApiRouter);
apiRouter.use("/membership", membershipApiRouter);

export default apiRouter;
