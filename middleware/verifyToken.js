const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

const verifyToken = (req, res, next) => {
  try {
    const authHeader =
      req.headers["Authorization"] || req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(currentUser);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = AppError.create("Invalid Token", 401, httpStatusText.FAIL);
    return next(error);
  }
};

module.exports = verifyToken;
