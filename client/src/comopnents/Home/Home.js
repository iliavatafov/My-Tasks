import { useContext, useEffect, useState } from "react";

import { EmployeesContext } from "../../context/EmployeesContext";
import { ModalContext } from "../../context/ModalContext";

import { getTopBottomEmployees } from "../../apis/employees";
import { Modal } from "../Modal/Modal";

import "./Home.css";

export const Home = () => {
  const [topFiveEmployees, setTopFiveEmployees] = useState(null);

  const { showModal, isModal, addModalMessages, modalMessages } =
    useContext(ModalContext);
  const { updateEmployees } = useContext(EmployeesContext);

  useEffect(() => {
    getTopBottomEmployees()
      .then((result) => {
        if (result.success) {
          setTopFiveEmployees(result);
        } else {
          addModalMessages(result.msg);
          showModal();
        }
      })
      .catch((error) => {
        addModalMessages(error.msg);
        showModal();
      });
  }, [updateEmployees]);

  return isModal ? (
    <Modal messages={modalMessages} />
  ) : (
    <div className="home-container">
      <div className="table-container">
        <h2 className="title">
          Employees with the largest number of completed tasks last month
        </h2>
        <div className="hr"></div>
        <table>
          <thead>
            <tr>
              <th>Employee id</th>
              <th>Name</th>
              <th>Assigned tasks</th>
              <th>Completed tasks</th>
              <th>Incompleted tasks</th>
              <th>Completed tasks (%)</th>
              <th>Incompleted tasks (%)</th>
            </tr>
          </thead>
          <tbody>
            {topFiveEmployees &&
              topFiveEmployees.data.topEmployeesLastMonth.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee._id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.totalTasks}</td>
                  <td>{employee.completedTasks}</td>
                  <td>{employee.incompleteTasks}</td>
                  <td>{employee.completedPercentage}%</td>
                  <td>{employee.incompletePercentage}%</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="table-container">
        <h2 className="title">
          Employees ranked by the percentage of completed tasks
        </h2>
        <div className="hr"></div>
        <table>
          <thead>
            <tr>
              <th>Employee id</th>
              <th>Name</th>
              <th>Assigned tasks</th>
              <th>Completed tasks</th>
              <th>Incompleted tasks</th>
              <th>Completed tasks (%)</th>
              <th>Incompleted tasks (%)</th>
            </tr>
          </thead>
          <tbody>
            {topFiveEmployees &&
              topFiveEmployees.data.topEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee._id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.totalTasks}</td>
                  <td>{employee.completedTasks}</td>
                  <td>{employee.incompleteTasks}</td>
                  <td>{employee.completedPercentage}%</td>
                  <td>{employee.incompletePercentage}%</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="table-container">
        <h2 className="title">
          Employees ranked by the percentage of incompleted tasks
        </h2>
        <div className="hr"></div>
        <table>
          <thead>
            <tr>
              <th>Employee id</th>
              <th>Name</th>
              <th>Assigned tasks</th>
              <th>Completed tasks</th>
              <th>Incompleted tasks</th>
              <th>Completed tasks (%)</th>
              <th>Incompleted tasks (%)</th>
            </tr>
          </thead>
          <tbody>
            {topFiveEmployees &&
              topFiveEmployees.data.bottomEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee._id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.totalTasks}</td>
                  <td>{employee.completedTasks}</td>
                  <td>{employee.incompleteTasks}</td>
                  <td>{employee.completedPercentage}%</td>
                  <td>{employee.incompletePercentage}%</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
