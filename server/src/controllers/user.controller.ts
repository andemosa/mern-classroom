import { NextFunction, Request, Response } from "express";

import { User } from "../models/user.model";

import { CreateUserInput } from "../schema/user.schema";

import dbErrorHandler from "../utils/dbErrorHandler";

const create = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({
        message: "User already registered.",
      });

    await User.create({ name, email, password });
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req: Request, res: Response) => {
  try {
    let users = await User.find().select("name email updatedAt createdAt");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const userByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  try {
    let user = await User.findById(id).select("name email updatedAt createdAt");

    if (!user)
      return res.status(400).json({
        error: "User not found",
      });

    res.locals.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user",
    });
  }
};

const read = (req: Request, res: Response) => {
  return res.json(res.locals.profile);
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  const update = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, update, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

const isEducator = (req: Request, res: Response, next: NextFunction) => {
  const isEducator = res.locals.profile && res.locals.profile.educator;
  if (!isEducator) {
    return res.status(403).json({
      error: "User is not an educator",
    });
  }
  next();
};

export default { create, userByID, read, list, remove, update, isEducator };
