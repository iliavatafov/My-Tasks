import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ModalContext } from "../../context/ModalContext";

import { updateTask } from "../../apis/tasks";
import { Modal } from "../Modal/Modal";

import "./Task.css";

export const MyTask = ({ task, assigneeData, updateEmployees }) => {
  const [inputValues, setInputValues] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate.slice(0, 10),
    assignee: task.assignee,
    status: task.status,
  });

  const { showModal, addModalMessages, isModal, modalMessages } =
    useContext(ModalContext);

  const onChange = (e) => {
    setInputValues((oldValues) => ({
      ...oldValues,
      [e.target.name]: e.target.value,
    }));
  };
  const navigate = useNavigate();

  const onUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateTask(task._id, inputValues);

      if (response.success) {
        updateEmployees();
        navigate("/my-tasks");
      } else {
        addModalMessages(response.msg);
        showModal();
      }
    } catch (error) {
      addModalMessages(error.message);
      showModal();
    }
  };

  return isModal ? (
    <Modal messages={modalMessages} />
  ) : (
    <div className="task-container-main main-my-tasks">
      <div className="task-details">
        <div>
          <span>Title:</span> {task.title}
        </div>
        <div className="description-container">
          <span>Description:</span> {task.description}
        </div>
        <div>
          <span>Due date:</span> {task.dueDate}
        </div>
        <div>
          <span>Assignee id:</span> {task.assignee}
        </div>
        <div>
          <span>Assignee name:</span>{" "}
          {assigneeData
            ? `${assigneeData.firstName} ${assigneeData.middleName} ${assigneeData.familyName}`
            : ""}
        </div>
        <div>
          <span>Created at:</span> {task.createdAt.slice(0, 10)}
        </div>
        <div>
          <span>Updated at:</span> {task.updatedAt.slice(0, 10)}
        </div>
        <div>
          <span>Status:</span> {task.status}
        </div>
      </div>
      <div className="actions-container my-task-action">
        <div className="select-container">
          <div>Change status</div>
          <select
            onChange={onChange}
            name="status"
            id="status"
            value={inputValues.status}
          >
            <option value="not started">Not Started</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="btn-container">
          <form onSubmit={onUpdate}>
            <input
              onSubmit={onUpdate}
              type="submit"
              className="action-btn"
              value="Update"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
