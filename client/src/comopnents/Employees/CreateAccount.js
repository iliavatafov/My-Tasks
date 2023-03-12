import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ModalContext } from "../../context/ModalContext";
import { EmployeesContext } from "../../context/EmployeesContext";

import { register } from "../../apis/auth";
import { Modal } from "../Modal/Modal";

import "../Login/Login.css";

export const CreateAccount = () => {
  const { id } = useParams();
  const { employees, updateEmployees } = useContext(EmployeesContext);
  const employee = employees.filter((e) => e._id === id)[0];

  const [invalidDataMessage, setInvalidDataMessage] = useState(null);
  const [inputValues, setInputValues] = useState({
    email: employee.email,
    name: `${employee.firstName} ${employee.middleName} ${employee.familyName}`,
    employeeId: id,
    password: "",
    repass: "",
  });

  const { showModal, isModal, addModalMessages, modalMessages } =
    useContext(ModalContext);

  const navigate = useNavigate();

  const onChange = (e) => {
    setInputValues((oldValues) => ({
      ...oldValues,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const { email, name, employeeId, password, repass } = inputValues;

    try {
      if (email === "" || name === "" || employeeId === "" || password === "") {
        setInvalidDataMessage([{ msg: "Email and password are required" }]);
        return;
      }

      if (password !== repass) {
        setInvalidDataMessage([
          { msg: "Password and repeat password shuld be equal" },
        ]);
        return;
      }

      const response = await register(email, name, employeeId, password);

      if (response.success) {
        updateEmployees();
        navigate("/employees-manager");
      } else {
        setInvalidDataMessage([response.msg]);
      }
    } catch (error) {
      addModalMessages(error.message);
      showModal();
    }
  };

  return isModal ? (
    <Modal messages={modalMessages} />
  ) : (
    <section id="login-page">
      <form id="login" onSubmit={onSubmit}>
        <div className="login-container">
          <h1>Create user accout</h1>
          <div className="input-container">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={inputValues.email}
              disabled
            />
          </div>
          <div className="input-container">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={inputValues.name}
              disabled
            />
          </div>
          <div className="input-container">
            <label htmlFor="register-password">Password:</label>
            <input
              type="password"
              name="password"
              autoComplete="on"
              placeholder="..."
              id="password"
              onChange={onChange}
              value={inputValues.password}
            />
          </div>
          <div className="input-container">
            <label htmlFor="register-password">Repeat password:</label>
            <input
              type="password"
              name="repass"
              autoComplete="on"
              placeholder="..."
              id="repass"
              onChange={onChange}
              value={inputValues.repass}
            />
          </div>
          {invalidDataMessage &&
            invalidDataMessage.map((el, i) => (
              <span key={i} className="invalid-message">
                * {el.msg}
              </span>
            ))}
          <input className="btn submit" type="submit" value="Create" />
        </div>
      </form>
    </section>
  );
};
