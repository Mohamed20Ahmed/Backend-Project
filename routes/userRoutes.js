const userController = require("../controller/userController");
const verifyToken = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("File:", file);
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split("/")[0];
  if (fileType === "image") return cb(null, true);
  else
    return cb(
      AppError.create("avatar should be image", 400, httpStatusText.FAIL),
      false
    );
};
const upload = multer({ storage: diskStorage, fileFilter });

router.get("/", verifyToken, userController.getAllUsers);

router.post("/register", upload.single("avatar"), userController.register);

router.post("/login", userController.login);

module.exports = router;
