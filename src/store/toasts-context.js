import { createContext, useState } from "react";

const ToastsContext = createContext({
  toasts: [],
  pushToast: (toast) => {},
  removeToast: (toast) => {},
});

export const ToastsContextProvider = (props) => {
  const [toasts, setToasts] = useState([]);

  const contextValue = {
    toasts: toasts,
    pushToast: (newToast) => setToasts((oldToasts) => [newToast, ...oldToasts]),
    removeToast: (toastToRemove) => {
      let indexOfToast = toasts.findIndex((t) => t === toastToRemove);
      if (indexOfToast !== -1) {
        setToasts((oldToasts) => {
          let toastArray = [...oldToasts];
          toastArray.splice(indexOfToast, 1);
          return [...toastArray];
        });
      }
    },
  };

  return (
    <ToastsContext.Provider value={contextValue}>
      {props.children}
    </ToastsContext.Provider>
  );
};

export default ToastsContext;
