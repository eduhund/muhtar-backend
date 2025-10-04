import { Router } from "express";
import { checkAuth } from "./security";
import endpoints from "../endpoints";

import { handleResponse } from "./responses";

const apiRouter = Router();

apiRouter.use(checkAuth);

apiRouter.use("/api/v1", endpoints);
apiRouter.use(handleResponse);

export default apiRouter;
