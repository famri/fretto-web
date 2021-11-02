import { Fragment } from "react";
import CustomModal from "./CustomModal";

import ReactDOM from "react-dom";

import "./SuccessModal.css";

const SuccessModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <CustomModal headerClassName="success-header" {...props}></CustomModal>,
        document.getElementById("success-modal")
      )}
    </Fragment>
  );
};

export default SuccessModal;
