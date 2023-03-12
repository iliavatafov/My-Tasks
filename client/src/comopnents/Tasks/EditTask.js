import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EmployeesContext } from "../../context/EmployeesContext";
import { ModalContext } from "../../context/ModalContext";

import { getTaskById, updateTask } from "../../apis/tasks";
import { Modal } from "../Modal/Modal";

import "./AddTask.css";

export const EditTask = () => {
  const [invalidDataMessage, setInvalidDataMessage] = useState(null);
  const [inputValues, setInputValues] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
    status: "",
  });

  const { employees } = useContext(EmployeesContext);
  const { showModal, addModalMessages, isModal, modalMessages } =
    useContext(ModalContext);

  const { id } = useParams();

  useEffect(() => {
    getTaskById(id)
      .then((result) => {
        if (result.success) {
          setInputValues({
            title: result.data.title,
            description: result.data.description,
            dueDate: result.data.dueDate.slice(0, 10),
            assignee: result.data.assignee,
            status: result.data.status,
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
  }, [addModalMessages, id, showModal]);

  const navigate = useNavigate();

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
        (x) => x[0] !== "assignee" && x[1] === ""
      )
    ) {
      setInvalidDataMessage([
        { msg: "All fileds exept assignee are required!" },
      ]);
    } else {
      try {
        const response = await updateTask(id, inputValues);

        if (response.success) {
          navigate("/task-manager");
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
    <div className="add-task-container">
      <form onSubmit={onSubmit} className="add-task-form">
        <div className="task-container">
          <h1>Update task</h1>
          <div className="input-container">
            <label htmlFor="title">
              Title <span>*</span>:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              onChange={onChange}
              value={inputValues.title}
            />
          </div>
          <div className="input-container">
            <label htmlFor="description">
              Description <span>*</span>:
            </label>
            <textarea
              type="text"
              id="description"
              name="description"
              onChange={onChange}
              value={inputValues.description}
            />
          </div>
          <div className="input-container">
            <label htmlFor="dueDate">
              Due date <span>*</span>:
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              onChange={onChange}
              value={inputValues.dueDate}
            />
          </div>
          <div className="input-container">
            <label htmlFor="assignee">
              Assignee <span>*</span>:
            </label>
            <select
              onChange={onChange}
              name="assignee"
              id="assignee"
              value={inputValues.assignee}
            >
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.firstName} {employee.middleName}{" "}
                  {employee.familyName}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="status">
              Status <span>*</span>:
            </label>
            <select
              name="status"
              id="status"
              onChange={onChange}
              value={inputValues.status}
            >
              <option value="not started">Not Started</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
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
