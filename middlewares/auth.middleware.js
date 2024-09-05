const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const User = require("../models/User");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
    req.cookies?.Token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const user = await User.findByPk(decodedToken.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      throw new ApiError(401, "Invalid Token Access");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid Token");
  }
});

module.exports = { verifyJWT };
