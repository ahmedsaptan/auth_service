const jwt = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config()
const {
  JWT_EXPIER_ACCESS_TOKEN = "1h",
  JWT_EXPIER_REFRESH_TOKEN = "1y",
  JWT_ACCESS_TOKEN_SECRET = "HGFHKTY",
  JWT_REFRESH_TOKEN_SECRET = "GJHGJJK",
} = process.env;
const client = require("../helpers/init_redis");

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };
    const options = {
      expiresIn: JWT_EXPIER_ACCESS_TOKEN,
      issuer: "FATURA.com",
    };

    jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, options, (err, token) => {
      if (err) {
        console.log(err);
        return reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };

    const options = {
      expiresIn: JWT_EXPIER_REFRESH_TOKEN,
      issuer: "FATURA.com",
    };

    jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, options, (err, token) => {
      if (err) {
        console.log(err);
        return reject(createError.InternalServerError());
      }
      // store the refresh token in redis...
      client.set(userId, token, "EX", 356 * 24 * 60 * 60, (err, reply) => {
        if (err) {
          console.log(err);
          return reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  });
};

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) return reject(createError.Unauthorized());
      const userId = payload.userId;
      client.get(userId, (err, result) => {
        if (err) {
          console.log(err);
          return reject(createError.InternalServerError());
        }

        if (refreshToken === result) {
          return resolve(userId);
        }
        reject(createError.Unauthorized());
      });
    });
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
