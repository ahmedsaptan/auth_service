const jwt = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config();
const { JWT_ACCESS_TOKEN_SECRET = "HGFHKTY" } = process.env;
const { models } = require("../models");
const checkPermission = (permissions) => {
  return (req, res, next) => {
    const role = req.user.role;
    if (permissions.includes(role)) {
      next();
    } else {
      next(createError.Forbidden());
    }
  };
};

const checkAuth = (req, res, next) => {
  try {
    let bearerToken = req.headers.authorization;
    if (!bearerToken) {
      next(createError.Unauthorized());
    }

    const token = bearerToken.split(" ")[1];
    jwt.verify(token, JWT_ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") next(createError.Unauthorized());
        else next(createError.Unauthorized(err.message));
      }
      req.userId = payload.userId;
      req.payload = payload;
      next();
    });
  } catch (e) {
    console.log(e);
    next(createError.Unauthorized());
  }
};

const extractUser = async (req, res, next) => {
  try {
    const user = await models.User.findOne({
      where: { id: req.userId },
    });

    if (!user) next(createError.NotFound("user not found"));
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  checkPermission,
  checkAuth,
  extractUser,
};
