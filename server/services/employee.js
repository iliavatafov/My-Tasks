const Employee = require("../models/Employee");
const Task = require("../models/Task");

function getAll() {
  return Employee.find({}).populate("tasks");
}

async function getTopAndBottomEmployees() {
  const employees = await Employee.find({
    "tasks.0": { $exists: true },
  }).populate("tasks");

  const employeeStats = employees.map((employee) => {
    const totalTasks = employee.tasks.length;
    const completedTasks = employee.tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const incompleteTasks = totalTasks - completedTasks;

    const completedPercentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const incompletePercentage =
      totalTasks === 0 ? 0 : Math.round((incompleteTasks / totalTasks) * 100);

    return {
      _id: employee._id,
      name: `${employee.firstName} ${employee.familyName}`,
      totalTasks,
      incompleteTasks,
      completedTasks,
      completedPercentage,
      incompletePercentage,
    };
  });

  const sortedEmployees = [...employeeStats].sort((a, b) => {
    if (b.completedPercentage !== a.completedPercentage) {
      return b.completedPercentage - a.completedPercentage;
    } else if (b.completedTasks !== a.completedTasks) {
      return b.completedTasks - a.completedTasks;
    } else {
      return a.incompleteTasks - b.incompleteTasks;
    }
  });

  const topEmployees = sortedEmployees.slice(0, 5);

  const bottomEmployees = sortedEmployees
    .sort((a, b) => {
      if (a.completedPercentage !== b.completedPercentage) {
        return a.completedPercentage - b.completedPercentage;
      } else {
        return b.incompleteTasks - a.incompleteTasks;
      }
    })
    .slice(0, 5);

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);

  const tasksLastMonth = await Task.find({
    assignee: { $exists: true },
    createdAt: { $gte: startDate },
  });

  const employeeStatsLastMonth = employeeStats.map((employee) => {
    const completedTasksLastMonth = tasksLastMonth.filter(
      (task) =>
        task.assignee.toString() === employee._id.toString() &&
        task.status === "completed"
    ).length;

    return {
      ...employee,
      completedTasksLastMonth,
    };
  });

  const sortedEmployeesLastMonth = [...employeeStatsLastMonth].sort((a, b) => {
    return b.completedTasksLastMonth - a.completedTasksLastMonth;
  });

  const topEmployeesLastMonth = sortedEmployeesLastMonth.slice(0, 5);

  return { topEmployees, bottomEmployees, topEmployeesLastMonth };
}

function getEmployeeById(id) {
  return Employee.findById(id).populate("tasks");
}

async function createEmployee(data) {
  const result = new Employee(data);
  await result.save();
  return result;
}

async function updateEmployee(id, data) {
  const existing = await Employee.findById(id).populate("account");

  existing.email = data.email;
  existing.firstName = data.firstName;
  existing.middleName = data.middleName;
  existing.familyName = data.familyName;
  existing.phoneNumber = data.phoneNumber;
  existing.dateOfBirth = data.dateOfBirth;
  existing.monthlySalary = data.monthlySalary;
  existing.tasks = data.tasks;

  await existing.save();
  return existing;
}

async function deleteEmployeeById(id) {
  return await Employee.findByIdAndDelete(id);
}

module.exports = {
  getAll,
  getTopAndBottomEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployeeById,
};
