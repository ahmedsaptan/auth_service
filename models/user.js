const { DataTypes } = require("sequelize");
const Sequelize = require("sequelize");

const { ADMIN, SUPER_ADMIN, USER } = require("../constants");
module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM({
        values: [ADMIN, SUPER_ADMIN, USER],
        defaultValue: USER,
        allowNull: false,
      }),
    },
  });
  return User;
};
