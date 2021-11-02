import { Fragment } from "react";
import CustomModal from "./CustomModal";

import ReactDOM from "react-dom";

import "./ErrorModal.css";

const ErrorModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <CustomModal headerClassName="error-header" titleClassName="title" {...props}></CustomModal>,
        document.getElementById("error-modal")
      )}
    </Fragment>
  );
};

export default ErrorModal;
