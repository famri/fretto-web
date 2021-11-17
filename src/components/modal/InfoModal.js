import { Fragment } from "react";
import CustomModal from "./CustomModal";

import ReactDOM from "react-dom";

import classes from "./InfoModal.module.css";

const InfoModal = (props) => {
  let infoModalId = "info-modal";
  if (props.id) {
    infoModalId = infoModalId + "-" + props.id.toString();
  }
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <CustomModal
          headerClassName={classes.infoHeader}
          {...props}
        ></CustomModal>,
        document.getElementById(infoModalId)
      )}
    </Fragment>
  );
};

export default InfoModal;
