import express from 'express'
import enrollmentCtrl from '../controllers/enrollment.controller'
import courseCtrl from '../controllers/course.controller'
import { verifyToken } from '../utils/verifyToken'

const router = express.Router()

router.route('/api/enrollment/enrolled')
  .get(verifyToken, enrollmentCtrl.listEnrolled)

router.route('/api/enrollment/new/:courseId')
  .post(verifyToken, enrollmentCtrl.findEnrollment, enrollmentCtrl.create)  

router.route('/api/enrollment/stats/:courseId')
  .get(enrollmentCtrl.enrollmentStats)

router.route('/api/enrollment/complete/:enrollmentId')
  .put(verifyToken, enrollmentCtrl.isStudent, enrollmentCtrl.complete) 

router.route('/api/enrollment/:enrollmentId')
  .get(verifyToken, enrollmentCtrl.isStudent, enrollmentCtrl.read)
  .delete(verifyToken, enrollmentCtrl.isStudent, enrollmentCtrl.remove)

router.param('courseId', courseCtrl.courseByID)
router.param('enrollmentId', enrollmentCtrl.enrollmentByID)

export default router
