const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const { isGuest, isAdmin, isAuth } = require("../middlewares/guards");
const mapErrors = require("../utils/mapper");

const {
  register,
  login,
  logout,
  deleteUser,
  updateUser,
} = require("../services/auth");

router.post(
  "/register",
  isAdmin(),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .toLowerCase()
    .withMessage("Invalid email address"),
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name should be at least two characters long"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  body("repass").trim(),
  body("employeeId").isMongoId().withMessage("Employee id should be valid"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(
          errors.errors.map((e) => ({
            msg: e.msg,
          }))
        );
      }

      const result = await register(
        req.body.email,
        req.body.name,
        req.body.password,
        req.body.employeeId
      );

      res.status(201).json(result);
    } catch (error) {
      const err = mapErrors(error);
      res.status(400).json(err);
    }
  }
);

router.put(
  "/:id",
  isAdmin(),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .toLowerCase()
    .withMessage("Invalid email address"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name should be at least two characters long"),
  body("password")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  body("repass").trim(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(
          errors.errors.map((e) => ({
            msg: e.msg,
          }))
        );
      }

      const result = await updateUser(req.params.id, {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
      });

      res.json(result);
    } catch (error) {
      const err = mapErrors(error);
      res.status(400).json(err);
    }
  }
);

router.post(
  "/login",
  body("email").trim().normalizeEmail(),
  isGuest(),
  async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        throw new Error("All fields are required");
      }
      const result = await login(req.body.email, req.body.password.trim());

      res.json(result);
    } catch (error) {
      const err = mapErrors(error);
      res.status(400).json(err);
    }
  }
);

router.delete("/:id", isAdmin(), async (req, res) => {
  const userId = req.params.id;

  try {
    await deleteUser(userId);
    res.status(204).end();
  } catch (error) {
    const err = mapErrors(error);
    res.status(400).json({ message: err });
  }
});

router.get("/logout", isAuth(), (req, res) => {
  logout(req.user?.token);
  res.status(204).end();
});

module.exports = router;
