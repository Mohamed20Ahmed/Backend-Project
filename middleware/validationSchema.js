const { body } = require("express-validator");

const validationSchema = [
  body("title")
    .notEmpty()
    .withMessage("Please Enter Course Title")
    .isLength({ min: 2 })
    .withMessage("Course Title Should be at least 2 characters"),
  body("price")
    .notEmpty()
    .withMessage("Please Enter Price")
    .isNumeric()
    .withMessage("Invalid Price"),
];

module.exports = validationSchema;
