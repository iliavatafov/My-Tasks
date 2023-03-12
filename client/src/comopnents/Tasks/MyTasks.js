import { useCallback, useContext, useEffect, useState } from "react";

import { AuthContext } from "../../context/AuthContext";
import { ModalContext } from "../../context/ModalContext";

import { getEmployeeById } from "../../apis/employees";
import { Modal } from "../Modal/Modal";
import { MyTask } from "./MyTask";

import "./MyTasks.css";

export const MyTasks = () => {
  const [update, setUpdate] = useState(false);
  const [employee, setEmployee] = useState(null);

  const { auth } = useContext(AuthContext);
  const { addModalMessages, showModal, isModal, modalMessages } =
    useContext(ModalContext);

  const updateEmployees = useCallback(() => {
    setUpdate((prev) => !prev);
  }, []);

  useEffect(() => {
    getEmployeeById(auth.employeeId)
      .then((result) => {
        if (result.success) {
          setEmployee(result.data);
        } else {
          addModalMessages(result.msg);
          showModal();
        }
      })
      .catch((error) => {
        addModalMessages(error.msg);
        showModal();
      });
  }, [addModalMessages, auth, showModal, update]);

  return isModal ? (
    <Modal messages={modalMessages} />
  ) : (
    <div className="my-tasks-container">
      {employee &&
        employee.tasks?.map((task) => (
          <MyTask
            key={task._id}
            task={task}
            updateEmployees={updateEmployees}
          />
        ))}
    </div>
  );
};
