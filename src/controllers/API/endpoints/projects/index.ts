import { Router } from "express";
import create from "./create";
import update from "./update";
import archive from "./archive";
import restore from "./restore";

const router = Router();

router.post("/create", create);
router.post("/:id/update", update);
router.post("/:id/archive", archive);
router.post("/:id/restore", restore);

export default router;
