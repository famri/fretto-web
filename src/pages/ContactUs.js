import { useEffect, useReducer } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import useHttp from "../hooks/use-http";
import { sendUserContactForm } from "../lib/contact-api";
import classes from "./ContactUs.module.css";
const validateEmail = (email) => {
  const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  return emailPattern.test(email);
};
const validatePhone = (phoneNumber) => {
  const phonePattern = /^[0-9]{8}$/;
  return phonePattern.test(phoneNumber);
};
const objectReducer = (state, action) => {
  switch (action.type) {
    case "MENU_OPENED":
      return {
        touched: true,
        val: state.val,
        isValid: state.isValid,
      };

    case "OBJECT_CHOSEN":
      return {
        touched: true,
        val: action.val,
        isValid: action.val !== "",
      };

    case "MENU_BLUR":
      return {
        touched: true,
        val: state.val,
        isValid: state.isValid,
      };

    case "INPUT_VALIDATION":
      return { touched: true, val: state.val, isValid: state.isValid };

    default:
      throw new Error();
  }
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

const iccReducer = (state, action) => {
  switch (action.type) {
    case "MENU_OPENED":
      return {
        touched: true,
        val: state.val,
        isValid: state.isValid,
      };

    case "ICC_CHOSEN":
      return {
        touched: true,
        val: action.val,
        isValid: action.val !== "",
      };

    case "MENU_BLUR":
      return {
        touched: true,
        val: state.val,
        isValid: state.isValid !== "",
      };

    case "INPUT_VALIDATION":
      return { touched: true, val: state.val, isValid: state.isValid };

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

const messageReducer = (state, action) => {
  switch (action.type) {
    case "MESSAGE_TOUCHED":
      return {
        touched: true,
        val: action?.val,
        isValid: action.val.length > 6,
      };

    case "MESSAGE_BLUR":
      return { touched: true, val: state?.val, isValid: state.isValid };
    case "INPUT_VALIDATION":
      return { touched: true, val: state?.val, isValid: state.isValid };
    default:
      throw new Error();
  }
};

const ContactUs = () => {
  const [objectState, dispatchObject] = useReducer(objectReducer, {
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
  const [iccState, dispatchIcc] = useReducer(iccReducer, {
    touched: false,
    val: "+216",
    isValid: true,
  });
  const [messageState, dispatchMessage] = useReducer(messageReducer, {
    touched: false,
    val: "",
    isValid: false,
  });
  const {
    sendRequest: sendContactForm,
    status,

    error,
  } = useHttp(sendUserContactForm);

  const submitContactForm = (event) => {
    event.preventDefault();
    dispatchObject({
      type: "INPUT_VALIDATION",
    });
    dispatchEmail({
      type: "INPUT_VALIDATION",
    });
    dispatchPhone({
      type: "INPUT_VALIDATION",
    });

    dispatchMessage({
      type: "INPUT_VALIDATION",
    });
    if (
      objectState.isValid &&
      emailState.isValid &&
      phoneState.isValid &&
      messageState.isValid
    ) {
      sendContactForm({
        subject: objectState.val,
        email: emailState.val,
        phone: iccState.val + " " + phoneState.val,
        message: messageState.val,
      });
    }
  };

  const objectClassName = objectState.touched
    ? objectState.isValid
      ? "is-valid"
      : "is-invalid"
    : "";

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
  const iccClassName =
    iccState && iccState.touched
      ? iccState.val && iccState.isValid
        ? "is-valid"
        : "is-invalid"
      : "";
  const messageClassName =
    messageState && messageState.touched
      ? messageState.val && messageState.val.length > 5
        ? "is-valid"
        : "is-invalid"
      : "";

  useEffect(() => {
    if (!!error) {
      return (
        <Container>
          <h1 className="d-flex justify-content-center my-auto error">
            {error}
          </h1>
        </Container>
      );
    }
    if (status === "pending") {
      return (
        <Container className="d-flex justify-content-center my-auto">
          <LoadingSpinner></LoadingSpinner>
        </Container>
      );
    }

    if (status === "completed") {
      return (
        <Container>
          <div
            className={
              classes.contactWelcome + " d-flex justify-content-center my-auto"
            }
          >
            <h1>Merci de nous avoir fait un retour !</h1>
            <h1>Nos conseillers ne tarderont pas à vous contacter.</h1>
          </div>
        </Container>
      );
    }
  }, [status, error]);

  return (
    <Container>
      <Row xs={1} md={1} className="mt-5 mb-5">
        <Col>
          <h1
            className={
              classes.contactWelcome + " d-flex justify-content-center"
            }
          >
            Dites nous tout !
          </h1>
        </Col>
      </Row>

      <Form
        onSubmit={(event) => {
          submitContactForm(event);
        }}
      >
        <Form.Group className="mb-3 ">
          <Row xs={2} md={2}>
            <Col xs={4} md={2}>
              <Form.Label className={classes.contactFormLabel + " mx-2"}>
                Sujet:
              </Form.Label>
            </Col>
            <Col xs={8} md={10}>
              <Form.Select
                className={objectClassName}
                required
                onChange={(event) =>
                  dispatchObject({
                    type: "OBJECT_CHOSEN",
                    val: event.target.value,
                  })
                }
                onClick={(event) =>
                  dispatchObject({
                    type: "MENU_OPENED",
                  })
                }
                onBlur={(event) =>
                  dispatchObject({
                    type: "MENU_BLUR",
                  })
                }
                value={objectState.val}
              >
                <option value="">Sujet</option>

                <option value="claim">Réclamation</option>
                <option value="question">Question</option>
                <option value="suggestion">Suggestion</option>
                <option value="other">Autre</option>
              </Form.Select>
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="mb-3">
          <Row xs={2} md={2}>
            <Col xs={4} md={2}>
              <Form.Label className={classes.contactFormLabel + " mx-2"}>
                Email:
              </Form.Label>
            </Col>
            <Col xs={8} md={10}>
              <Form.Control
                className={emailClassName}
                required
                type="email"
                placeholder="Votre email"
                onChange={(e) =>
                  dispatchEmail({
                    type: "USER_INPUT",
                    val: e.target.value,
                  })
                }
                onBlur={() => dispatchEmail({ type: "INPUT_BLUR" })}
                value={emailState.val}
              ></Form.Control>
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="mb-3">
          <Row xs={2} md={2}>
            <Col xs={4} md={2}>
              <Form.Label className={classes.contactFormLabel + " mx-2"}>
                Mobile:
              </Form.Label>
            </Col>
            <Col xs={8} md={10}>
              <Row xs={2} md={2}>
                <Col xs={5} md={2}>
                  <Form.Select
                    className={iccClassName}
                    required
                    onChange={(event) =>
                      dispatchIcc({
                        type: "ICC_CHOSEN",
                        val: event.target.value,
                      })
                    }
                    onClick={(event) =>
                      dispatchIcc({
                        type: "MENU_OPENED",
                      })
                    }
                    onBlur={(event) =>
                      dispatchIcc({
                        type: "MENU_BLUR",
                      })
                    }
                    value={iccState.val}
                  >
                    <option value="">Indicateur</option>
                    <option value="+216">+216</option>
                  </Form.Select>
                </Col>
                <Col xs={7} md={10}>
                  <Form.Control
                    className={phoneClassName}
                    required
                    type="number"
                    placeholder="N° mobile"
                    onChange={(e) =>
                      dispatchPhone({
                        type: "USER_INPUT",
                        val: e.target.value,
                      })
                    }
                    onBlur={() => dispatchPhone({ type: "INPUT_BLUR" })}
                    value={phoneState.val}
                  ></Form.Control>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="mb-3">
          <Row xs={2} md={2}>
            <Col xs={4} md={2}>
              <Form.Label className={classes.contactFormLabel + " mx-2"}>
                Message:
              </Form.Label>
            </Col>
            <Col xs={8} md={10}>
              <Form.Control
                required
                className={messageClassName}
                value={messageState.val}
                onChange={(e) =>
                  dispatchMessage({
                    type: "MESSAGE_TOUCHED",
                    val: e.target.value,
                  })
                }
                onBlur={(e) =>
                  dispatchMessage({
                    type: "MESSAGE_BLUR",
                    val: e.target.value,
                  })
                }
                as="textarea"
                rows={3}
                placeholder="Dites nous tout !"
              />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group>
          <Button
            type="submit"
            variant="success"
            className="my-5 py-2 col-12 fs-2 fw-bold"
          >
            Envoyer
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default ContactUs;
