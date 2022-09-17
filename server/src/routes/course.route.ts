import express from "express";

import userController from "../controllers/user.controller";
import courseCtrl from "../controllers/course.controller";


import { verifyToken, isOwner } from "../utils/verifyToken";

const router = express.Router();

router
  .route("/api/courses/by/:userId")
  .post(
    verifyToken, isOwner,
    userController.isEducator,
    courseCtrl.create
  );

export default router;
