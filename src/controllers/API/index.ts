import { Router } from "express";
import endpoints from "./endpoints";

import { handleResponse } from "./responses";

const apiRouter = Router();

apiRouter.use("/api/v1", endpoints);
apiRouter.use(handleResponse);

export default apiRouter;
