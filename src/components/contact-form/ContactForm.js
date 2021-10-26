import { useReducer, useState } from "react";
import { Form, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import "./ContactForm.css";
import logo from "../../assets/logos/fretto_logo.png";

const validateName = (fullName) => {
  const fullNamePattern = /^([A-Za-z]+\s+[A-Za-z]+\s*)+$/;
  return fullNamePattern.test(fullName);
};

const validateEmail = (email) => {
  const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  return emailPattern.test(email);
};

const validatePhone = (phoneNumber) => {
  const phonePattern = /^[0-9]{8}$/;
  return phonePattern.test(phoneNumber);
};

const emailReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT":
      return {
        touched: true,
        val: action.val,
        isValid: validateEmail(action.val),
      };
    case "INPUT_BLUR":
      return {
        touched: state.touched,
        val: state.val,
        isValid: validateEmail(state.val),
      };
    case "INPUT_VALIDATION":
      return {
        touched: true,
        val: state.val,
        isValid: validateEmail(state.val),
      };
    default:
      throw new Error();
  }
};

const nameReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT":
      return {
        touched: true,
        val: action.val,
        isValid: validateName(action.val),
      };
    case "INPUT_BLUR":
      return {
        touched: state.touched,
        val: state.val,
        isValid: validateName(state.val),
      };
    case "INPUT_VALIDATION":
      return {
        touched: true,
        val: state.val,
        isValid: validateName(state.val),
      };
    default:
      throw new Error();
  }
};

const phoneReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT":
      return {
        touched: true,
        val: action.val,
        isValid: validatePhone(action.val),
      };
    case "INPUT_BLUR":
      return {
        touched: state.touched,
        val: state.val,
        isValid: validatePhone(state.val),
      };
    case "INPUT_VALIDATION":
      return {
        touched: true,
        val: state.val,
        isValid: validatePhone(state.val),
      };
    default:
      throw new Error();
  }
};

const ContactForm = (props) => {
  const [nameState, dispatchName] = useReducer(nameReducer, {
    touched: false,
    val: "",
    isValid: false,
  });

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    touched: false,
    val: "",
    isValid: false,
  });

  const [phoneState, dispatchPhone] = useReducer(phoneReducer, {
    touched: false,
    val: "",
    isValid: false,
  });

  const [checkedTos, setCheckedTos] = useState(true);

  const emailClassName = emailState.touched
    ? emailState.isValid
      ? "is-valid"
      : "is-invalid"
    : "";
  const phoneClassName = phoneState.touched
    ? phoneState.isValid
      ? "is-valid"
      : "is-invalid"
    : "";
  const nameClassName = nameState.touched
    ? nameState.isValid
      ? "is-valid"
      : "is-invalid"
    : "";

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    dispatchEmail({ type: "INPUT_VALIDATION" });
    dispatchPhone({ type: "INPUT_VALIDATION" });
    dispatchName({ type: "INPUT_VALIDATION" });
    if (
      emailState.isValid &&
      phoneState.isValid &&
      nameState.isValid &&
      checkedTos
    ) {
      props.handleSubmit(nameState.val, emailState.val, phoneState.val);
    }
  };

  return (
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
          <img src={logo} alt="Fretto logo" className="header-logo"></img>
          <h1>Laissez-nous vos coordonnées</h1>
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={(event) => handleContactSubmit(event)}>
        <Modal.Body className="modal-body show-grid contact-form">
          <Form.Group className="mb-3">
            <Form.Label>Nom complet:</Form.Label>
            <Form.Control
              className={nameClassName}
              required
              type="text"
              placeholder="Prénom Nom"
              onChange={(e) =>
                dispatchName({ type: "USER_INPUT", val: e.target.value })
              }
              onBlur={() => dispatchName({ type: "INPUT_BLUR" })}
              value={nameState.val}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              className={emailClassName}
              required
              type="email"
              placeholder="Votre email"
              onChange={(e) =>
                dispatchEmail({ type: "USER_INPUT", val: e.target.value })
              }
              onBlur={() => dispatchEmail({ type: "INPUT_BLUR" })}
              value={emailState.val}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Téléphone Mobile:</Form.Label>
            <Form.Control
              className={phoneClassName}
              required
              type="number"
              placeholder="Votre numéro de téléphone"
              onChange={(e) =>
                dispatchPhone({ type: "USER_INPUT", val: e.target.value })
              }
              onBlur={() => dispatchPhone({ type: "INPUT_BLUR" })}
              value={phoneState.val}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="J'accepte de recevoir les offres de la part de Fretto et ses partenaires."
              className="fs-3"
              checked={checkedTos}
              onChange={() => setCheckedTos(!checkedTos)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="success"
            className="fs-2 py-3"
            disabled={!checkedTos}
          >
            Recevoir mes devis
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default ContactForm;
