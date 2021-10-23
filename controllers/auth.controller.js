const { models } = require("../models");
const { body } = require("express-validator");
const { checkValidations } = require("../helpers/validation");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");
const bcrypt = require("bcryptjs");
const { ADMIN, SUPER_ADMIN, USER } = require("../constants");
const createError = require("http-errors");
const client = require("../helpers/init_redis");

const validateLogin = () => {
  return [
    body("email")
      .trim()
      .not()
      .isEmpty()
      .withMessage("email is required")
      .bail()
      .isEmail()
      .withMessage("email not valid")
      .bail()
      .custom(async (value, { req }) => {
        try {
          const existUser = await models.User.findOne({
            where: {
              email: value,
            },
          });
          if (!existUser) {
            throw createError.NotFound("User not registered");
          }
          req.existUser = existUser;
          return true;
        } catch (e) {
          throw e;
        }
      }),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("password is required")
      .isLength({ min: 8, max: 20 })
      .withMessage("password must be greter than 8 char and less than 20 char"),
  ];
};

const login = async (req, res, next) => {
  try {
    let body = checkValidations(req);
    let user = req.existUser;
    if (user) {
      const match = await bcrypt.compare(body.password, user.password);
      if (!match) throw createError.NotFound("email/password not valid");
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      return res.status(200).send({
        accessToken,
        refreshToken,
      });
    }
    return next(createError.NotFound("email/password not valid"));
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const validateRegister = () => {
  return [
    body("email")
      .trim()
      .exists()
      .withMessage("email is required")
      .notEmpty()
      .withMessage("email can't be empty")
      .bail()
      .isEmail()
      .withMessage("email not valid")
      .custom(async (value, { req }) => {
        let email = value.toLowerCase().trim();
        let query = { email: email };
        let exist = await models.User.findOne({ where: query });
        if (exist) {
          throw createError.Conflict(
            `${value}: email is already been registered`
          );
        }
      }),
    body("name")
      .trim()
      .exists()
      .withMessage("name is required")
      .notEmpty()
      .withMessage("name can't be empty"),
    body("password")
      .trim()
      .exists()
      .withMessage("password is required")
      .notEmpty()
      .withMessage("password can't be empty")
      .isLength({ min: 8, max: 20 })
      .withMessage("password must be greter than 8 char and less than 20 char"),
    body("role")
      .trim()
      .exists()
      .withMessage("role is required")
      .notEmpty()
      .withMessage("role can't be empty")
      .isIn([ADMIN, SUPER_ADMIN, USER])
      .withMessage(`role must be one of  ${ADMIN}, ${SUPER_ADMIN}, ${USER}`),
  ];
};
const register = async (req, res, next) => {
  try {
    let body = checkValidations(req);
    body.email = body.email.toLowerCase();
    body.password = bcrypt.hashSync(body.password, 10);
    let user = await models.User.create(body);
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    return res.status(201).send({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const validateLogout = () => {
  return [
    body("refreshToken")
      .exists()
      .withMessage("refreshToken is required")
      .notEmpty()
      .withMessage("refreshToken"),
  ];
};
const logout = async (req, res, next) => {
  try {
    const body = checkValidations(req);
    const userId = await verifyRefreshToken(body.refreshToken);
    client.del(userId, (err, reply) => {
      if (err) {
        console.log(err);
        throw createError.InternalServerError();
      }
      console.log(reply);
      res.status(200).send();
    });
  } catch (e) {
    next(e);
  }
};

const validateRefreshToken = () => {
  return [
    body("refreshToken")
      .exists()
      .withMessage("refreshToken is required")
      .notEmpty()
      .withMessage("refreshToken"),
  ];
};

const refreshToken = async (req, res, next) => {
  try {
    let body = checkValidations(req);
    const userId = await verifyRefreshToken(body.refreshToken);
    const accessToken = await signAccessToken(userId);
    const refreshToken = await signRefreshToken(userId);

    return res.status(201).send({
      accessToken,
      refreshToken,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  register,
  validateLogin,
  validateRegister,
  login,
  logout,
  refreshToken,
  validateLogout,
  validateRefreshToken,
};
