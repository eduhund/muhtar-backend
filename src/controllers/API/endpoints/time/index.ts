import { Router } from "express";
import { checkAuth } from "../../security";
import getTimeList from "./getTimeList";
import getTime from "./getTime";
import add from "./add";
import update from "./update";
import archive from "./archive";
import restore from "./restore";

const router = Router();

router.use(checkAuth);

router.get("/", getTimeList);
router.get("/:id", getTime);
router.post("/add", add);
router.post("/:id/update", update);
router.post("/:id/archive", archive);
router.post("/:id/restore", restore);

export default router;
