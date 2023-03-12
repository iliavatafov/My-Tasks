const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Full name is required"],
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee id is required"],
    },
    isAdmin: { type: Boolean, default: false },
    hashedPassword: { type: String, require: true },
  },
  { timestamps: true }
);

userSchema.post("save", async function (doc) {
  const Employee = require("./Employee");
  const employee = await Employee.findById(doc.employeeId);

  if (!employee) {
    throw new Error("Employee not found");
  }

  employee.account = doc._id;
  await employee.save();
});

userSchema.index({
  email: 1,
  collation: {
    locale: "en",
    strength: 1,
  },
});

const User = model("User", userSchema);

module.exports = User;
