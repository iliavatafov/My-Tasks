const express = require("express");
const cors = require("./middlewares/cors");
const auth = require("./middlewares/auth");
const expressConfig = require("./config/express");
const databaseConfig = require("./config/database");
const routesConfig = require("./config/routes");

start();

async function start() {
  const app = express();

  expressConfig(app);
  await databaseConfig(app);
  app.use(cors());
  app.use(auth());
  routesConfig(app);

  app.listen(5000, () => console.log(`REST service runing on port 5000...`));
}
