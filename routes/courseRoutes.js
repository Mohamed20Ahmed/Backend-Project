const courseController = require("../controller/courseController");
const validator = require("../middleware/validationSchema");
const userRoles = require("../utils/userRoles");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(validator, courseController.createCourse);

router
  .route("/:id")
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    courseController.deleteCourse
  );

module.exports = router;
