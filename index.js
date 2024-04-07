const express = require("express");
const util = require("util");
const redis = require("redis"); // There is another option other package "ioredis"

const PORT = process.env.PORT || 3001;

//Connect Redis
const redisUrl = `redis://127.0.0.1:6379`;
const client = redis.createClient(redisUrl);
// Convert error-first callback style into functions that return promises.
client.set = util.promisify(client.set);
client.get = util.promisify(client.get);

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const { key, value } = req.body;
  const response = await client.set(key, value);
  res.json(response);
});

app.get("/", async (req, res) => {
  const { key } = req.body;
  const value = await client.get(key);
  res.json(value);
});

app.listen(PORT, () => {
  console.log(`App running on the PORT ${PORT}`);
});
