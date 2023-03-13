import { useContext, useState } from "react";
import { useParams } from "react-router-dom";

import { EmployeesContext } from "../../context/EmployeesContext";
import { ModalContext } from "../../context/ModalContext";

import { updateEmployee } from "../../apis/employees";
import { Modal } from "../Modal/Modal";

export const EditEmployee = () => {
  const { employeeEdit, employees } = useContext(EmployeesContext);
  const { id } = useParams();
  const employeeData = employees.find((e) => e._id === id);
  employeeData.dateOfBirth = employeeData.dateOfBirth.slice(0, 10);

  const [inputValues, setInputValues] = useState(employeeData);
  const [invalidDataMessage, setInvalidDataMessage] = useState(null);

  const { showModal, addModalMessages, modalMessages, isModal } =
    useContext(ModalContext);

  const onChange = (e) => {
    setInputValues((oldValues) => ({
      ...oldValues,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      Object.entries(inputValues).some(
        (x) => x[0] !== "middleName" && x[1] === ""
      )
    ) {
      setInvalidDataMessage([
        { msg: "All fileds exept middlename are required!" },
      ]);
    } else {
      try {
        const response = await updateEmployee(id, inputValues);
        if (response.success) {
          employeeEdit(id, response.data);
        } else {
          setInvalidDataMessage(response.msg);
        }
      } catch (error) {
        showModal();
        addModalMessages(error.message);
      }
    }
  };

  return isModal ? (
    <Modal messages={modalMessages} />
  ) : (
    <div className="add-employee-container">
      <form onSubmit={onSubmit} className="add-form">
        <div className="create-container">
          <h1>Update Employee Data</h1>
          <div className="input-container">
            <label htmlFor="email">
              Email <span>*</span>:
            </label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={onChange}
              value={inputValues.email}
            />
          </div>
          <div className="input-container">
            <label htmlFor="firstName">
              First name <span>*</span>:
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              onChange={onChange}
              value={inputValues.firstName}
            />
          </div>
          <div className="input-container">
            <label htmlFor="middleName">Middle name (opstiona):</label>
            <input
              type="text"
              id="middleName"
              name="middleName"
              onChange={onChange}
              value={inputValues.middleName}
            />
          </div>
          <div className="input-container">
            <label htmlFor="familyName">
              Family name <span>*</span>:
            </label>
            <input
              type="text"
              id="familyName"
              name="familyName"
              onChange={onChange}
              value={inputValues.familyName}
            />
          </div>
          <div className="input-container">
            <label htmlFor="dateOfBirth">
              Data of birth <span>*</span>:
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              onChange={onChange}
              value={inputValues.dateOfBirth}
            />
          </div>
          <div className="input-container">
            <label htmlFor="phoneNumber">
              Phone number <span>*</span>:
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              onChange={onChange}
              value={inputValues.phoneNumber}
            />
          </div>
          <div className="input-container">
            <label htmlFor="monthlySalary">
              Monthly salary <span>*</span>:
            </label>
            <input
              type="number"
              id="monthlySalary"
              name="monthlySalary"
              onChange={onChange}
              value={inputValues.monthlySalary}
            />
          </div>
          {invalidDataMessage &&
            invalidDataMessage.map((el, i) => (
              <span key={i} className="invalid-message">
                * {el.msg}
              </span>
            ))}
          <input
            onSubmit={onSubmit}
            className="submit-btn"
            type="submit"
            value="Update"
          />
        </div>
      </form>
    </div>
  );
};
