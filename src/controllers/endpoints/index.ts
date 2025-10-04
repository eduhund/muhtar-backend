import { Router } from "express";

import { checkAuth } from "../security";

import projectsRouter from "./projects";
import teamsRouter from "./teams";
import timeRouter from "./time";

import login from "./login";
import getMe from "./getMe";

const router = Router();

router.use("/login", login);
router.use("/me", checkAuth, getMe);
router.use("/projects", projectsRouter);
router.use("/teams", teamsRouter);
router.use("/time", timeRouter);

export default router;
