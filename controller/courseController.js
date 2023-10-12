const Course = require("../model/courseModel");
const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const AppError = require("../utils/appError");

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getCourse = asyncWrapper(async (req, res, next) => {
  const courseData = await Course.findById(req.params.id);
  if (!courseData) {
    const error = AppError.create("Course not found", 400, httpStatusText.FAIL);
    return next(error);
  }

  res.json({ status: httpStatusText.SUCCESS, data: { course: courseData } });
});

const createCourse = asyncWrapper(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = AppError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const newCourse = new Course(req.body);
  await newCourse.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const updatedCourse = await Course.updateOne(
    { _id: req.params.id },
    {
      $set: { ...req.body },
    }
  );

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { course: updatedCourse },
  });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  await Course.deleteOne({ _id: req.params.id });

  res.status(200).json({ status: "success", data: null });
});

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
