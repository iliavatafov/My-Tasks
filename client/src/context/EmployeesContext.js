import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "./AuthContext";
import { ModalContext } from "./ModalContext";

import { getAllEmployees } from "../apis/employees";

export const EmployeesContext = createContext();

const bookReducer = (state, action) => {
  switch (action.type) {
    case "ADD_EMPLOYEES":
      return [...action.payload];
    case "ADD_EMPLOYEE":
      return [action.payload, ...state];
    case "EDIT_EMPLOYEE":
      return state.map((x) => (x._id === action._id ? action.payload : x));
    case "DELETE_EMPLOYEE":
      return state.filter((x) => x._id !== action._id);
    default:
      return state;
  }
};

export const EmployeesProvider = ({ children }) => {
  const [update, setUpdate] = useState(false);
  const [employees, dispatcher] = useReducer(bookReducer, []);

  const { showModal, addModalMessages } = useContext(ModalContext);
  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAdmin) {
      getAllEmployees()
        .then((result) => {
          if (result.success) {
            window.localStorage.setItem(
              "employees",
              JSON.stringify(result.data)
            );
            return dispatcher({
              type: "ADD_EMPLOYEES",
              payload: result.data,
            });
          } else {
            addModalMessages(result.msg);
            showModal();
          }
        })
        .catch((error) => {
          addModalMessages(error.msg);
          showModal();
        });
    }
  }, [addModalMessages, showModal, auth, update]);

  const employeesLocalStorage = JSON.parse(localStorage.getItem("employees"));

  if (employees.length === 0 && employeesLocalStorage) {
    dispatcher({
      type: "ADD_EMPLOYEES",
      payload: JSON.parse(localStorage.getItem("employees")),
    });
  }

  const updateEmployees = useCallback(() => {
    setUpdate((prev) => !prev);
  }, []);

  const addEmployee = (employeeData) => {
    dispatcher({
      type: "ADD_EMPLOYEE",
      payload: employeeData.data,
    });
    navigate("/employees-manager");
  };

  const employeeEdit = (employeeId, employeeData) => {
    dispatcher({
      type: "EDIT_EMPLOYEE",
      payload: employeeData,
      _id: employeeId,
    });
    navigate("/employees-manager");
  };

  const employeeDelete = async (employeeId) => {
    dispatcher({
      type: "DELETE_EMPLOYEE",
      _id: employeeId,
    });
    navigate("/employees-manager");
  };

  return (
    <EmployeesContext.Provider
      value={{
        employees,
        updateEmployees,
        addEmployee,
        employeeEdit,
        employeeDelete,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};
