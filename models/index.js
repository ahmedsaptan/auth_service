const Sequelize = require("sequelize");
require("dotenv").config();
const dbConfig = require("../config/db.config");

console.log(dbConfig);
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
});

require("./user")(sequelize);
require("./product")(sequelize);

module.exports = sequelize;
