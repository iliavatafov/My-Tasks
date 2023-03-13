import { useContext, useEffect } from "react";

import { ModalContext } from "../../context/ModalContext";

import "../Modal/Modal.css";

export const Modal = ({ messages }) => {
  const { hideModal, addModalMessages, isModal } = useContext(ModalContext);

  useEffect(() => {
    if (!isModal) {
      addModalMessages([]);
    }
  }, [isModal, addModalMessages]);

  const closeModal = () => {
    hideModal();
  };

  return (
    <div className="error-page" onClick={closeModal}>
      <div className="error-message-container">
        <div className="error-message">
          {messages.map((m, i) => (
            <p key={i}>{m.msg}</p>
          ))}
        </div>
        <button onClick={closeModal}>OK</button>
      </div>
    </div>
  );
};
