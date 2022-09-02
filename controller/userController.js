const User = require("../model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const doc = await User.find();
 
  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
