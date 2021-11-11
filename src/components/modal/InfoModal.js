import { Fragment } from "react";
import CustomModal from "./CustomModal";

import ReactDOM from "react-dom";

import classes from "./InfoModal.module.css";

const InfoModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <CustomModal
          headerClassName={classes.infoHeader}
          {...props}
        ></CustomModal>,
        document.getElementById("info-modal")
      )}
    </Fragment>
  );
};

export default InfoModal;
