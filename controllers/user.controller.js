const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, monthly_budget } = req.body;
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required except monthly_budget");
  }
  const existedUser = await User.findOne({
    where: { username: username, email: email },
  });
  if (existedUser) {
    throw new ApiError(409, "Username or email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    monthly_budget,
  });
  const createdUser = await User.findByPk(user.id, {
    attributes: { exclude: ["password"] },
  });
  res.status(201).json(new ApiResponse(200, createdUser, "User created"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (![email, password]) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordMatched(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Wrong password");
  }
  const token = await user.generateToken();
  const loggedInUser = await User.findByPk(user.id, {
    attributes: {
      exclude: ["password"],
    },
  });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("Token", token, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          token,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("Token", options)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const setMonthlyBudget = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { monthly_budget } = req.body;
  try {
    if (!monthly_budget) {
      throw new ApiError(400, "Monthly budget is required");
    }
    await User.update({ monthly_budget }, { where: { id: userId } });
    res
      .status(200)
      .json(new ApiResponse(200, monthly_budget, "Monthly Budget Updated"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "An error occurred while updating the budget"
        )
      );
  }
});

module.exports = { registerUser, loginUser, logoutUser, setMonthlyBudget };
