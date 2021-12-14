import { Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import ReactDOM from "react-dom";
import SignUpForm from "../signup-form/SignUpForm";
import "./SignUpModal.css";
const SignUpModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Modal
          size="md"
          show={props.show}
          onHide={props.handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h1>Créer votre compte pour recevoir vos devis</h1>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="mx-auto">
            <SignUpForm
              onSignup={props.onSignup}
              errorMessage={props.errorMessage}
              isLoading={props.isLoading}
            ></SignUpForm>
          </Modal.Body>
        </Modal>,
        document.getElementById("signup-modal")
      )}
    </Fragment>
  );
};
export default SignUpModal;
