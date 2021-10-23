const { DataTypes } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define("Product", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: DataTypes.STRING,
  });
  return Product;
};
