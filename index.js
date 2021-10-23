require("./helpers/init_redis");
const sequelize = require("./models");

// databases sync.
sequelize
  .sync({ alter: true, logging: true })
  .then(() => {
    console.log("sync");
  })
  .catch((e) => {
    console.log(e);
  });
const app = require("./app");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is on ${PORT}`);
});
