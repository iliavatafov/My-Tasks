import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EmployeesContext } from "../../context/EmployeesContext";

import { TaskDetails } from "./TaskDetails";

import "./EmployeeDetails.css";

export const EmployeeDetails = () => {
  const { id } = useParams();
  const { employees } = useContext(EmployeesContext);
  const employee = employees.filter((emplyee) => emplyee._id === id)[0];

  const navigate = useNavigate();

  return (
    <div className="details-master">
      <div className="employee-details-container">
        <div className="employee-data">
          <div>
            <span>Employee Id:</span> {employee._id}
          </div>
          <div>
            <span>Name:</span> {employee.firstName} {employee.middleName}{" "}
            {employee.familyName}
          </div>
          <div>
            <span>Date Of Birth:</span> {employee.dateOfBirth.slice(0, 10)}
          </div>
          <div>
            <span>Phone Number:</span> {employee.phoneNumber}
          </div>
          <div>
            <span>Monthly Salary:</span> {employee.monthlySalary} BGN
          </div>
          <div>
            <span>Created at:</span> {employee.createdAt.slice(0, 10)}
          </div>
          <div>
            <span>Updated at:</span> {employee.updatedAt.slice(0, 10)}
          </div>
          <div className="employee-actions">
            <input
              onClick={() => navigate("/employee-edit/" + employee._id)}
              type="submit"
              className="action-btn"
              value="Edit"
            />
          </div>
        </div>
      </div>
      <div className="employee-tasks-container">
        <div className="task-header">
          <h2 className="title">Task list</h2>
          <hr />
        </div>
        <div className="tasks">
          {employee.tasks.map((task) => (
            <TaskDetails key={task._id} task={task} employeeId={employee._id} />
          ))}
        </div>
      </div>
    </div>
  );
};
