import { Router } from "express";
import { checkAuth } from "../../security";
import getTeams from "./getTeams";
import getTeam from "./getTeam";
import archive from "./archive";
import restore from "./restore";
import update from "./update";
import invite from "./invite";
import changeAccessRole from "./changeAccessRole";
import removeMembership from "./removeMembership";
import addWorkRole from "./addWorkRole";
import updateWorkRole from "./updateWorkRole";
import removeWorkRole from "./removeWorkRole";

const router = Router();

router.use(checkAuth);

router.get("/", getTeams);
router.get("/:id", getTeam);
router.post("/create");
router.post("/:id/update", update);
router.post("/:id/archive", archive);
router.post("/:id/restore", restore);
router.post("/:id/invite", invite);
router.post("/:id/changeAccessRole", changeAccessRole);
router.post("/:id/removeMembership", removeMembership);
router.post("/:id/addWorkRole", addWorkRole);
router.post("/:id/updateWorkRole", updateWorkRole);
router.post("/:id/removeWorkRole", removeWorkRole);

export default router;
