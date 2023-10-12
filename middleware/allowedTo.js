const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role))
      return next(AppError.create("unauthorised", 401, httpStatusText.FAIL));

    next();
  };
};
