const { model, Schema } = require("mongoose");
const Employee = require("./Employee");

const validator = require("validator");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters long"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [3, "Description must be at least 3 characters long"],
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return validator.isDate(v);
        },
        message: (props) => `${props.value} is not a valid due date!`,
      },
    },
    assignee: { type: Schema.Types.ObjectId, ref: "Employee" },
    status: { type: String, required: [true, "Status is required"] },
  },
  { timestamps: true }
);

taskSchema.post("save", async function (doc) {
  const assignee = await Employee.findById(doc.assignee);
  assignee.tasks.push(doc._id);
  await assignee.save();
});

taskSchema.statics.updateTaskById = async function (id, updatedTaskData) {
  const task = await this.findById(id);

  if (!task) {
    throw new Error("Task not found");
  }

  const oldAssignee = task.assignee;
  const newAssignee = updatedTaskData.assignee;

  if (oldAssignee.toString() !== newAssignee.toString()) {
    const oldEmployee = await Employee.findById(oldAssignee);

    if (oldEmployee) {
      oldEmployee.tasks.pull(task._id);
      await oldEmployee.save();
    }

    const newEmployee = await Employee.findById(newAssignee);
    newEmployee.tasks.push(task._id);
    await newEmployee.save();
  }

  const updatedTask = await this.findByIdAndUpdate(
    id,
    { $set: updatedTaskData },
    { new: true }
  );
  return updatedTask;
};

taskSchema.index({ createdAt: 1 });

const Task = model("Task", taskSchema);

module.exports = Task;
