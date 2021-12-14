import { Fragment, useEffect, useReducer } from "react";
import { Button, Card, Col, Form, Spinner } from "react-bootstrap";
import FrettoLogo from "../components/logos/FrettoLogo";
import useHttp from "../hooks/use-http";
import { requestPasswordReset } from "../lib/password-reset-api";
import classes from "./PasswordReset.module.css";
const validateEmail = (email) => {
  const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  return emailPattern.test(email);
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

const PasswordReset = () => {
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    touched: false,
    val: "",
    isValid: false,
  });

  const {
    sendRequest: sendResetPasswordRequest,
    status,
    error,
  } = useHttp(requestPasswordReset);

  const emailClassName = emailState.touched
    ? emailState.isValid
      ? "is-valid"
      : "is-invalid"
    : "";

  const paswordResetRequestHandler = (event) => {
    event.preventDefault();
    dispatchEmail({ type: "INPUT_VALIDATION" });
    if (emailState.isValid) {
      sendResetPasswordRequest({
        username: emailState.val,
        locale: "fr_FR",
      });
    }
  };

  useEffect(() => {}, [status, error]);

  if (status === "completed") {
    return (
      <p
        className={
          classes.passwordRestTitle +
          " d-flex justify-content-center my-auto fs-1"
        }
      >
        Consultez votre boite email.
        <br /> Nous vous avons envoyé le lien de réinitialisation de votre mot
        de passe.
      </p>
    );
  }
  return (
    <Fragment>
      <FrettoLogo width="170px"></FrettoLogo>
      <h2 className={classes.passwordRestTitle + " text-center py-2 fs-1"}>
        Vous avez oublié votre mot de passe ?
      </h2>
      <h2 className={classes.passwordRestTitle + " text-center py-2 fs-1 mb-5"}>
        Réinitialiser le en deux minutes !
      </h2>

      <div className="mx-auto">
        <Card className={classes.passwordResetCard + " py-4 "}>
          <Form
            className="px-4"
            onSubmit={(event) => paswordResetRequestHandler(event)}
          >
            <Form.Group className="mb-3">
              <Form.Label className={classes.formLabel}>Email</Form.Label>
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

            {!!error && <p className="error">{error}</p>}
            <Form.Group>
              <Col>
                <Button
                  type="submit"
                  variant="success"
                  className="col-12 py-3 mt-4 btn-fretto"
                  disabled={status === "pending"}
                >
                  {status === "pending" && (
                    <Spinner animation="border" variant="light" />
                  )}
                  <span className="mx-2 ">Réinitialiser </span>
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Card>
      </div>
    </Fragment>
  );
};

export default PasswordReset;
