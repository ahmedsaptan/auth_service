const redis = require("redis");
const redisConfig = require("../config/redis.config");
const client = redis.createClient({
  host: redisConfig.HOST,
  port: redisConfig.port,
});

client.on("connect", () => {
  console.log("client connected to redis..");
});

client.on("ready", () => {
  console.log("client connected to redis & ready to use...");
});
client.on("error", (e) => {
  console.log(e.message);
});

client.on("end", () => {
  console.log("client disconnected from redis...");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
