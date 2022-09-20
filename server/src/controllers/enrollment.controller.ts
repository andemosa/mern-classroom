import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

import { Enrollment, IEnrollment } from "../models/enrollment.model";

import dbErrorHandler from "../utils/dbErrorHandler";

const create = async (req: Request, res: Response) => {
  let newEnrollment: Partial<IEnrollment> = {
    course: res.locals.course,
    student: res.locals.auth,
  };
  newEnrollment.lessonStatus = res.locals.course.lessons.map(
    (lesson: Types.ObjectId) => {
      return { lesson: lesson, complete: false };
    }
  );
  const enrollment = new Enrollment(newEnrollment);
  try {
    let result = await enrollment.save();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

/**
 * Load enrollment and append to req.
 */
const enrollmentByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  try {
    let enrollment = await Enrollment.findById(id)
      .populate({ path: "course", populate: { path: "instructor" } })
      .populate("student", "_id name");
    if (!enrollment)
      return res.status(400).json({
        error: "Enrollment not found",
      });
    res.locals.enrollment = enrollment;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve enrollment",
    });
  }
};

const read = (req: Request, res: Response) => {
  return res.json(res.locals.enrollment);
};

const complete = async (req: Request, res: Response) => {
  let updatedData = {};
  updatedData["lessonStatus.$.complete"] = req.body.complete;
  updatedData.updated = Date.now();
  if (req.body.courseCompleted)
    updatedData.completed = req.body.courseCompleted;

  try {
    let enrollment = await Enrollment.updateOne(
      { "lessonStatus._id": req.body.lessonStatusId },
      { $set: updatedData }
    );
    res.json(enrollment);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    let enrollment = req.enrollment;
    let deletedEnrollment = await enrollment.remove();
    res.json(deletedEnrollment);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const isStudent = (req: Request, res: Response, next: NextFunction) => {
  const isStudent = res.locals.auth && res.locals.auth.id == res.locals.enrollment.student._id;
  if (!isStudent) {
    return res.status(403).json({
      error: "User is not enrolled",
    });
  }
  next();
};

const listEnrolled = async (req: Request, res: Response) => {
  try {
    let enrollments = await Enrollment.find({ student: req.auth._id })
      .sort({ completed: 1 })
      .populate("course", "_id name category");
    res.json(enrollments);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const findEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let enrollments = await Enrollment.find({
      course: res.locals.course._id,
      student: res.locals.auth._id,
    });
    if (enrollments.length == 0) {
      next();
    } else {
      res.json(enrollments[0]);
    }
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const enrollmentStats = async (req: Request, res: Response) => {
  try {
    let stats = {};
    stats.totalEnrolled = await Enrollment.find({
      course: req.course._id,
    }).countDocuments();
    stats.totalCompleted = await Enrollment.find({ course: req.course._id })
      .exists("completed", true)
      .countDocuments();
    res.json(stats);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  enrollmentByID,
  read,
  remove,
  complete,
  isStudent,
  listEnrolled,
  findEnrollment,
  enrollmentStats,
};
