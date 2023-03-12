import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmployeesContext } from "../../context/EmployeesContext";
import { ModalContext } from "../../context/ModalContext";

import { deleteTask, updateTask } from "../../apis/tasks";
import { Modal } from "../Modal/Modal";

import "./TaskDetails.css";

export const TaskDetails = ({ task, employeeId }) => {
  const { employees, updateEmployees } = useContext(EmployeesContext);
  const assigneeData = employees.filter((a) => a._id === task.assignee)[0];
  const [inputValues, setInputValues] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate.slice(0, 10),
    assignee: assigneeData ? task.assignee : employees[0]._id,
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
        navigate("/employee-details/" + employeeId);
        updateEmployees();
      } else {
        showModal();
        addModalMessages(response.msg);
      }
    } catch (error) {
      showModal();
      addModalMessages(error.message);
    }
  };

  const onDelete = async () => {
    try {
      const result = await deleteTask(task._id);
      if (result.success) {
        updateEmployees();
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
    <div className="task-container-main">
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
      <div className="actions-container">
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
        <div className="select-container">
          <div>Assignee</div>
          <select
            onChange={onChange}
            name="assignee"
            id="assignee"
            value={inputValues.assignee}
          >
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.firstName} {employee.middleName} {employee.familyName}
              </option>
            ))}
          </select>
        </div>
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
        <input
          onClick={() => navigate("/task-edit/" + task._id)}
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
