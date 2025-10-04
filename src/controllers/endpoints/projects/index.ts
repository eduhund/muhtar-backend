import { Router } from "express";
import { checkAuth } from "../../security";
import getProjects from "./getProjects";
import getProject from "./getProject";
import create from "./create";
import update from "./update";
import archive from "./archive";
import restore from "./restore";
import addMemberships from "./addMemberships";
import removeMembership from "./removeMembership";

const router = Router();

router.use(checkAuth);

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/create", create);
router.post("/:id/update", update);
router.post("/:id/archive", archive);
router.post("/:id/restore", restore);
router.post("/:id/addMemberships", addMemberships);
router.post("/:id/removeMembership", removeMembership);

export default router;
