const Sequelize = require("sequelize");
const {
  DATA_BASE_NAME = "db",
  DATA_BASE_USER_NAME = "root",
  DATA_BASE_PASSWORD = "abc123",
  DATA_BASE_HOST = "localhost",
  BATA_BASE_PORT = 3307,
} = process.env;

const sequelize = new Sequelize({
  username: DATA_BASE_USER_NAME,
  password: DATA_BASE_PASSWORD,
  host: DATA_BASE_HOST,
  database: DATA_BASE_NAME,
  port: BATA_BASE_PORT,
  dialect: "mysql",
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true,
  },
  logging: false,
});

require("./user")(sequelize);
require("./product")(sequelize);

module.exports = sequelize;
