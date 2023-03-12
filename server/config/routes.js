const authController = require("../controllers/auth");
const employeeController = require("../controllers/employee");
const taskController = require("../controllers/task");

module.exports = (app) => {
  app.use("/users", authController);
  app.use("/employees", employeeController);
  app.use("/tasks", taskController);
};
