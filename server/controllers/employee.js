const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const { isAdmin, isAuth } = require("../middlewares/guards");

const employeeService = require("../services/employee");
const mapErrors = require("../utils/mapper");

router.get("/", isAdmin(), async (req, res) => {
  try {
    const employees = await employeeService.getAll().populate("account");

    employees.sort((a, b) => b.createdAt - a.createdAt);
    res.json(employees);
  } catch (error) {
    const err = mapErrors(error);
    res.status(400).json(err);
  }
});

router.get("/top-bottom-employees", async (req, res) => {
  try {
    const employees = await employeeService.getTopAndBottomEmployees();
    res.json(employees);
  } catch (error) {
    const err = mapErrors(error);
    res.status(400).json(err);
  }
});

router.get("/:id", isAuth(), async (req, res) => {
  const employeeId = req.params.id;
  try {
    const employee = await employeeService.getEmployeeById(employeeId);
    if (!employee) {
      return res.status(404).json([{ msg: "Employee not found" }]);
    }
    res.json(employee);
  } catch (error) {
    const err = mapErrors(error);
    res.status(400).json(err);
  }
});

router.post(
  "/",
  isAdmin(),
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email address"),
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("middleName").optional().trim(),
    body("familyName").trim().notEmpty().withMessage("Family name is required"),
    body("phoneNumber")
      .trim()
      .matches(/^\d{3}-?\d{3}-?\d{4}$/)
      .withMessage("Phone number must be in the format ###-###-####"),
    body("dateOfBirth")
      .trim()
      .isDate()
      .withMessage("Date of birth must be a valid date XXXX-XX-XX"),
    body("monthlySalary")
      .trim()
      .isNumeric()
      .withMessage("Monthly salary must be a number"),
    body("tasks").optional().isArray().withMessage("Tasks must be an array"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(
        errors.errors.map((e) => ({
          msg: e.msg,
        }))
      );
    }

    const employeeData = {
      email: req.body.email,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      familyName: req.body.familyName,
      phoneNumber: req.body.phoneNumber,
      dateOfBirth: req.body.dateOfBirth,
      monthlySalary: req.body.monthlySalary,
    };

    try {
      const createdEmployee = await employeeService.createEmployee(
        employeeData
      );
      res.status(201).json(createdEmployee);
    } catch (error) {
      const err = mapErrors(error);
      res.status(400).json(err);
    }
  }
);

router.put(
  "/:id",
  isAdmin(),
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email address"),
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("middleName").optional().trim(),
    body("familyName").trim().notEmpty().withMessage("Family name is required"),
    body("phoneNumber")
      .trim()
      .matches(/^\d{3}-?\d{3}-?\d{4}$/)
      .withMessage("Phone number must be in the format ###-###-####"),
    body("dateOfBirth")
      .trim()
      .isDate()
      .withMessage("Date of birth must be a valid date"),
    body("monthlySalary")
      .trim()
      .isNumeric()
      .withMessage("Monthly salary must be a number"),
    body("tasks").optional().isArray().withMessage("Tasks must be an array"),
  ],
  async (req, res) => {
    const employeeId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(
        errors.errors.map((e) => ({
          msg: e.msg,
        }))
      );
    }

    const employeeData = {
      email: req.body.email,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      familyName: req.body.familyName,
      phoneNumber: req.body.phoneNumber,
      dateOfBirth: req.body.dateOfBirth,
      monthlySalary: req.body.monthlySalary,
      tasks: req.body.tasks,
    };

    try {
      const updatedEmployee = await employeeService.updateEmployee(
        employeeId,
        employeeData
      );

      if (!updatedEmployee) {
        return res.status(404).json([{ msg: "Employee not found" }]);
      }
      res.json(updatedEmployee);
    } catch (error) {
      const err = mapErrors(error);
      res.status(400).json(err);
    }
  }
);

router.delete("/:id", isAdmin(), async (req, res) => {
  const employeeId = req.params.id;
  try {
    const deletedEmployee = await employeeService.deleteEmployeeById(
      employeeId
    );

    if (!deletedEmployee) {
      return res.status(404).json([{ msg: "Employee not found" }]);
    }
    res.status(204).end();
  } catch (error) {
    const err = mapErrors(error);
    res.status(400).json(err);
  }
});

module.exports = router;
