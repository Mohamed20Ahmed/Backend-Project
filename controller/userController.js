const User = require("../model/userModel");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwtGenerator = require("../utils/jwtGenerator");

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const userExistence = await User.findOne({ email: req.body.email });
  if (userExistence) {
    const error = AppError.create(
      "User Already Exist",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const hashedpassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    ...req.body,
    password: hashedpassword,
    avatar: req.file.filename,
  });
  const token = await jwtGenerator({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });

  newUser.token = token;
  await newUser.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = AppError.create(
      "email and password are required",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    const error = AppError.create(
      "user is not found",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const auth = await bcrypt.compare(password, user.password);
  const token = await jwtGenerator({
    email: user.email,
    id: user._id,
    role: user.role,
  });

  if (auth) res.status(200).json({ status: "success", data: { token } });
  else {
    const error = AppError.create(
      "Inncorrect password",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
});

module.exports = { getAllUsers, register, login };
