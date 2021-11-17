import { Fragment } from "react";
import CustomModal from "./CustomModal";

import ReactDOM from "react-dom";

import "./SuccessModal.css";

const SuccessModal = (props) => {
  let successModalId = "success-modal";
  if (props.id) {
    successModalId = successModalId + "-" + props.id.toString();
  }
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <CustomModal headerClassName="success-header" {...props}></CustomModal>,
        document.getElementById(successModalId)
      )}
    </Fragment>
  );
};

export default SuccessModal;
