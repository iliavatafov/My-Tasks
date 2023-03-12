import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { EmployeesContext } from "../../context/EmployeesContext";

import { Employee } from "./Employee";

import "./Employees.css";

export const Employees = () => {
  const { employees } = useContext(EmployeesContext);

  const navigate = useNavigate();

  return (
    <div className="employees-container">
      <input
        onClick={() => navigate("/add-employee")}
        type="submit"
        className="add-btn"
        value="Add New Employee"
      />
      {employees.map((e) => (
        <Employee key={e._id} employee={e} />
      ))}
    </div>
  );
};
