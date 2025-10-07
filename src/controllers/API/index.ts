import { Router } from "express";
import authApiRouter from "./AuthAPI";
import membershipApiRouter from "./MembershipAPI";
import userApiRouter from "./UserAPI";

const apiRouter = Router();

apiRouter.use("/auth", authApiRouter);
apiRouter.use("/membership", membershipApiRouter);
apiRouter.use("/user", userApiRouter);

export default apiRouter;
