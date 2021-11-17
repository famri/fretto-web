import { Fragment } from "react";
import CustomModal from "./CustomModal";

import ReactDOM from "react-dom";

import "./ErrorModal.css";

const ErrorModal = (props) => {
  let errorModalId = "error-modal";
  if (props.id) {
    errorModalId = errorModalId + "-" + props.id.toString();
  }
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <CustomModal headerClassName="error-header" titleClassName="title" {...props}></CustomModal>,
        document.getElementById(errorModalId)
      )}
    </Fragment>
  );
};

export default ErrorModal;
