const { model, Schema } = require("mongoose");

const validator = require("validator");

const employeeSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    firstName: { type: String, required: [true, "First name is required"] },
    middleName: { type: String },
    familyName: { type: String, required: [true, "Family name is required"] },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    dateOfBirth: {
      type: Date,
      dateOnly: true,
      validate: {
        validator: function (v) {
          return validator.isDate(v);
        },
        message: (props) => `${props.value} is not a valid date of birth!`,
      },
      toJSON: {
        transform: function (doc, ret) {
          ret.dateOfBirth = ret.dateOfBirth.toISOString().slice(0, 10);
        },
      },
    },
    monthlySalary: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (v) {
          return v >= 800;
        },
        message: (props) =>
          `${props.value} is not a valid monthly salary! Minimum salary is 800.`,
      },
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    account: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

employeeSchema.index({
  email: 1,
  collation: {
    locale: "en",
    strength: 1,
  },
});

const Employee = model("Employee", employeeSchema);

module.exports = Employee;
