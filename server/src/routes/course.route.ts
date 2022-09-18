import express from "express";

import userCtrl from "../controllers/user.controller";
import courseCtrl from "../controllers/course.controller";

import { verifyToken, isOwner } from "../utils/verifyToken";

const router = express.Router();

router.route("/api/courses/published").get(courseCtrl.listPublished);

router
  .route("/api/courses/by/:userId")
  .post(verifyToken, isOwner, userCtrl.isEducator, courseCtrl.create)
  .get(verifyToken, isOwner, courseCtrl.listByInstructor);

router.route("/api/courses/photo/:courseId").get(courseCtrl.photo);

router
  .route("/api/courses/:courseId/lesson/new")
  .put(verifyToken, courseCtrl.isInstructor, courseCtrl.newLesson);

router
  .route("/api/courses/:courseId")
  .get(courseCtrl.read)
  .put(verifyToken, courseCtrl.isInstructor, courseCtrl.update)
  .delete(verifyToken, courseCtrl.isInstructor, courseCtrl.remove);

router.param("courseId", courseCtrl.courseByID);
router.param("userId", userCtrl.userByID);

export default router;
