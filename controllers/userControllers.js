const User = require("../models/User");
const utilFuncs = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const path = require("path");
const fs = require("fs");

const getUserProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) throw new CustomError.NotFoundError("User not found.");
  res.status(StatusCodes.OK).json({ message: "Success", user });
};

const updateUserProfile = async (req, res) => {
  const user = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(StatusCodes.OK).json({ message: "Success", user });
};

const updateUserProfilePhoto = async (req, res) => {
  if (!req.files) throw new CustomError.BadRequestError("No file selected");
  const img = req.files.image;
  if (!img.mimetype.startsWith("image"))
    throw new CustomError.UnsupportedFormatError("Media type not supported.");
  console.log(img);
  const maxSize = 1024 * 1024 * 2;
  if (img.size > maxSize) {
    fs.unlinkSync(req.files.image.tempFilePath);
    throw new CustomError.BadRequestError("Image size must not exceed 2mb.");
  }

  const imgPath = path.resolve(__dirname, "../uploads", `${img.name}`);
  await img.mv(imgPath);
  const result = await utilFuncs.uploadPhoto(imgPath);
  const user = await User.findOne({ _id: req.user.userId });
  const { secure_url } = result;
  user.profilePhoto = secure_url;
  await user.save();
  fs.unlinkSync(req.files.image.tempFilePath);
  res
    .status(StatusCodes.OK)
    .json({ message: "Successfully updated profile photo.", user });
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserProfilePhoto,
};
