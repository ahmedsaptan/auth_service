const { models } = require("../models");
const { body } = require("express-validator");
const { checkValidations } = require("../helpers/validation");
const createError = require("http-errors");

const validate = () => {
  return [
    body("title")
      .exists()
      .withMessage("title is requird")
      .notEmpty()
      .withMessage("title can't be empty"),
  ];
};

const createProduct = async (req, res, next) => {
  try {
    let body = checkValidations(req);
    let product = await models.Product.create(body);

    res.status(201).send({
      product,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    let products = await models.Product.findAndCountAll({});
    return res.status(200).send({
      products,
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    let { id } = req.params;
    let product = await models.Product.findOne({ where: { id } });

    if (!product) return next(createError.NotFound("product not found"));
    res.status(200).send({ product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let { id } = req.params;
    const body = checkValidations(req);
    let product = await models.Product.findOne({ where: { id } });

    if (!product) {
      next(createError.NotFound("product not found"));
    }
    product.title = body.title;
    await product.save();
    res.status(200).send({ product });
  } catch (error) {
    next(error);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    let { id } = req.params;
    let product = await models.Product.findOne({ where: { id } });

    if (!product) {
      next(createError.NotFound("product not found"));
    }
    const result = await product.destroy();
    res.status(200).send({ product: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validate,
  getProduct,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};
