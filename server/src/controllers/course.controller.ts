import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import { extend } from "lodash";
import fs from "fs";

import { Course, Lesson } from "../models/course.model";
import dbErrorHandler from "../utils/dbErrorHandler";

const create = (req: Request, res: Response) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    let course = new Course(fields);
    course.instructor = res.locals.profile;
    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path);
      course.image.contentType = files.image.type;
    }
    try {
      let result = await course.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: dbErrorHandler.getErrorMessage(err),
      });
    }
  });
};

/**
 * Load course and append to req.
 */
const courseByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  try {
    let course = await Course.findById(id).populate("instructor", "_id name");
    if (!course)
      return res.status(400).json({
        error: "Course not found",
      });
    res.locals.course = course;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve course",
    });
  }
};

const read = (req: Request, res: Response) => {
  res.locals.course.image = undefined;
  return res.json(res.locals.course);
};

const list = async (req: Request, res: Response) => {
  try {
    let courses = await Course.find().select("name email updated created");
    res.json(courses);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const update = async (req: Request, res: Response) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let course = res.locals.course;
    course = extend(course, fields);
    if (fields.lessons) {
      course.lessons = JSON.parse(fields.lessons as string);
    }

    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path);
      course.image.contentType = files.image.type;
    }

    try {
      const updatedUser = await Course.findOneAndUpdate(
        { _id: course._id },
        course,
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      return res.status(400).json({
        error: dbErrorHandler.getErrorMessage(err),
      });
    }
  });
};

const newLesson = async (req: Request, res: Response) => {
  try {
    let lesson = await Lesson.create(req.body.lesson);
    let result = await Course.findByIdAndUpdate(
      res.locals.course._id,
      { $push: { lessons: lesson } },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    let course = await Course.findByIdAndDelete(req.params.courseId);
    res.json(course);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const isInstructor = (req: Request, res: Response, next: NextFunction) => {
  const isInstructor =
    res.locals.course &&
    res.locals.auth &&
    res.locals.course.instructor._id.toString() === res.locals.auth.id.toString();
  if (!isInstructor) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

const listByInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await Course.find({
      instructor: res.locals.profile._id,
    }).populate("instructor", "_id name");

    res.json(courses);
  } catch (error) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(error),
    });
  }
};

const listPublished = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ published: true }).populate(
      "instructor",
      "_id name"
    );

    res.json(courses);
  } catch (error) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(error),
    });
  }
};

const photo = async (req: Request, res: Response) => {
  let course = res.locals.course;
  if (course && course.image.data) {
    res.set("Content-Type", course.image.contentType);
    return res.send(course.image.data);
  }
  return res.status(400).json({
    error: "Image could not be found",
  });
};

export default {
  create,
  courseByID,
  read,
  list,
  remove,
  update,
  isInstructor,
  listByInstructor,
  photo,
  newLesson,
  listPublished,
};
