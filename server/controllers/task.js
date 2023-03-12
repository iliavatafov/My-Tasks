const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const Task = require("../models/Task");

const { isAdmin, isAuth } = require("../middlewares/guards");

const taskService = require("../services/task");
const mapErrors = require("../utils/mapper");

const validateTaskData = () => {
  return [
    body("title")
      .isString()
      .withMessage("Title must be a string")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
    body("description")
      .isString()
      .withMessage("Description must be a string")
      .isLength({ min: 3 })
      .withMessage("Description must be at least 3 characters long"),
    body("dueDate").isDate().withMessage("Due date must be a valid date"),
    body("assignee")
      .optional()
      .isMongoId()
      .withMessage("Assignee be a valid MongoDB ObjectId"),
    body("status")
      .isIn(["not started", "in progress", "completed"])
      .withMessage(
        "Status must be one of 'not started', 'in progress', or 'completed'"
      ),
  ];
};

router.post("/", isAdmin(), validateTaskData(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(
      errors.errors.map((e) => ({
        msg: e.msg,
      }))
    );
  }

  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    const err = mapErrors(error);
    res.status(400).json(err);
  }
});

router.get("/", isAdmin(), async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    tasks.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(tasks);
  } catch (error) {
    const err = mapErrors(error);
    res.status(400).json(err);
  }
});

router.get("/:id", isAuth(), async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json([{ msg: "Task not found" }]);
    }
    res.status(200).json(task);
  } catch (error) {
    const err = mapErrors(error);
    res.status(400).json(err);
  }
});

router.put("/:id", isAuth(), validateTaskData(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(
      errors.errors.map((e) => ({
        msg: e.msg,
      }))
    );
  }
  try {
    const task = await Task.updateTaskById(req.params.id, req.body);
    if (!task) {
      return res.status(404).json([{ msg: "Task not found" }]);
    }
    res.status(200).json(task);
  } catch (error) {
    const err = mapErrors(error);
    res.status(400).json(err);
  }
});

router.delete("/:id", isAdmin(), async (req, res) => {
  try {
    const task = await taskService.deleteTaskById(req.params.id);
    if (!task) {
      return res.status(404).json([{ msg: "Task not found" }]);
    }
    res.status(204).end();
  } catch (error) {
    const err = mapErrors(error);
    res.status(400).json(err);
  }
});

module.exports = router;
