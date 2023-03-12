import { useCallback, useState } from "react";
import { createContext } from "react";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isModal, setIsModal] = useState(false);
  const [modalMessages, setModalMessages] = useState([]);

  const showModal = useCallback(() => {
    setIsModal(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsModal(false);
  }, []);

  const addModalMessages = useCallback((messages) => {
    setModalMessages(messages);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isModal,
        modalMessages,
        showModal,
        hideModal,
        addModalMessages,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
