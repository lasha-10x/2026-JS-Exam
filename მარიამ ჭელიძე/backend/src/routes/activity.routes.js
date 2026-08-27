import { Router } from "express";
import { clearActivity, createActivity, deleteActivity, getActivity } from "../controllers/activity.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.route("/").get(getActivity).post(createActivity).delete(clearActivity);
router.delete("/:id", deleteActivity);

export default router;
