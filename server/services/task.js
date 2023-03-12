const Task = require("../models/Task");

async function createTask(taskData) {
  const newTask = new Task(taskData);
  await newTask.save();
  return newTask;
}

async function getAllTasks() {
  const tasks = await Task.find();
  return tasks;
}

async function getTaskById(taskId) {
  const task = await Task.findById(taskId);
  return task;
}

async function deleteTaskById(taskId) {
  const task = await Task.findByIdAndDelete(taskId);
  return task;
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTaskById,
};
