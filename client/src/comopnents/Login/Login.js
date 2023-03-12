import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import { ModalContext } from "../../context/ModalContext";

import { Modal } from "../Modal/Modal";
import { login } from "../../apis/auth";

import "../Login/Login.css";

export const Login = () => {
  const [invalidDataMessage, setInvalidDataMessage] = useState(null);
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });

  const { userLogin } = useContext(AuthContext);
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

    const { email, password } = inputValues;

    try {
      if (email == "" || password == "") {
        setInvalidDataMessage([{ msg: "Email and password are required" }]);
      }

      const response = await login(email, password);

      if (response.success) {
        userLogin(response.data);
        setInputValues({
          email: "",
          password: "",
        });
        navigate("/");
      } else {
        setInvalidDataMessage(response.msg);
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
          <h1>Login</h1>
          <div className="input-container">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="somthing@gmail.com"
              onChange={onChange}
              value={inputValues.email}
            />
          </div>
          <div className="input-container">
            <label htmlFor="register-password">Password:</label>
            <input
              type="password"
              name="password"
              autoComplete="on"
              placeholder="..."
              id="register-password"
              onChange={onChange}
              value={inputValues.password}
            />
          </div>
          {invalidDataMessage &&
            invalidDataMessage.map((el, i) => (
              <span key={i} className="invalid-message">
                * {el.msg}
              </span>
            ))}
          <input className="btn submit" type="submit" value="Login" />
        </div>
      </form>
    </section>
  );
};
