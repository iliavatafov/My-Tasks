import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { EmployeesContext } from "../../context/EmployeesContext";
import { ModalContext } from "../../context/ModalContext";

import { deleteEmployee } from "../../apis/employees";
import { Modal } from "../Modal/Modal";

import "./Employee.css";

export const Employee = ({ employee }) => {
  const { employeeDelete } = useContext(EmployeesContext);
  const { showModal, addModalMessages, isModal, modalMessages } =
    useContext(ModalContext);

  const navigate = useNavigate();

  const onDelete = async () => {
    try {
      const result = await deleteEmployee(employee._id);
      if (result.success) {
        employeeDelete(employee._id);
      } else {
        addModalMessages(result.msg);
        showModal();
      }
    } catch (error) {
      showModal();
      addModalMessages(error.message);
    }
  };
  return isModal ? (
    <Modal messages={modalMessages} />
  ) : (
    <div className="employee-container">
      <div className="employee-details">
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
        <div>
          <span>Company accoutn email:</span>{" "}
          {employee.account ? employee.account.email : "No associated account"}
        </div>
        {employee.account && (
          <div>
            <span>Company accoutn id:</span> {employee.account._id}
          </div>
        )}
      </div>
      <div className="employee-actions">
        {!employee.account ? (
          <input
            onClick={() => navigate(`/create-account/${employee._id}`)}
            type="submit"
            className="action-btn"
            value="Create accout"
          />
        ) : (
          <input
            onClick={() => navigate(`/update-account/${employee._id}`)}
            type="submit"
            className="action-btn"
            value="Update accout"
          />
        )}
        <input
          onClick={() => navigate("/employee-details/" + employee._id)}
          type="submit"
          className="action-btn"
          value="Details"
        />
        <input
          onClick={() => navigate("/employee-edit/" + employee._id)}
          type="submit"
          className="action-btn"
          value="Edit"
        />
        <input
          onClick={onDelete}
          type="submit"
          className="action-btn"
          value="Delete"
        />
      </div>
    </div>
  );
};
