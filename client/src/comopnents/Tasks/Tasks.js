import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmployeesContext } from "../../context/EmployeesContext";
import { ModalContext } from "../../context/ModalContext";

import { getAllTasks } from "../../apis/tasks";
import { Modal } from "../Modal/Modal";
import { Task } from "./Task";

import "./Tasks.css";

export const Tasks = () => {
  const [update, setUpdate] = useState(false);
  const [tasks, setTasks] = useState([]);

  const { employees } = useContext(EmployeesContext);
  const { showModal, addModalMessages, isModal, modalMessages } =
    useContext(ModalContext);

  const navigate = useNavigate();

  const updateEmployees = useCallback(() => {
    setUpdate((prev) => !prev);
  }, []);

  useEffect(() => {
    getAllTasks()
      .then((result) => {
        if (result.success) {
          setTasks(result.data);
        } else {
          addModalMessages(result.msg);
          showModal();
        }
      })
      .catch((error) => {
        addModalMessages(error.msg);
        showModal();
      });
  }, [addModalMessages, showModal, update]);

  return isModal ? (
    <Modal messages={modalMessages} />
  ) : (
    <div className="tasks-container">
      <div className="add-task-container flex-task">
        <input
          onClick={() => navigate("/add-task")}
          type="submit"
          className="add-task-btn"
          value="Add New Task"
        />
      </div>
      <div className="tasks-box">
        {tasks.length > 0 &&
          tasks.map((task) => (
            <Task
              key={task._id}
              task={task}
              employees={employees}
              updateEmployees={updateEmployees}
            />
          ))}
      </div>
    </div>
  );
};
