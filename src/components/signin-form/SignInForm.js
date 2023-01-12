import { useReducer } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import classes from "./SignInForm.module.css";

const validateEmail = (email) => {
  const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  return emailPattern.test(email);
};

const validatePassword = (password) => {
  const passwordPattern = /^[0-9a-zA-Z@#$%^&+=(?=\\S+$)]{8,20}$/;
  return passwordPattern.test(password);
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

const passwordReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT":
      return {
        touched: true,
        val: action.val,
        isValid: validatePassword(action.val),
      };
    case "INPUT_BLUR":
      return {
        touched: state.touched,
        val: state.val,
        isValid: validatePassword(state.val),
      };
    case "INPUT_VALIDATION":
      return {
        touched: true,
        val: state.val,
        isValid: validatePassword(state.val),
      };
    default:
      throw new Error();
  }
};

const SignInForm = (props) => {
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    touched: false,
    val: "",
    isValid: false,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    touched: false,
    val: "",
    isValid: false,
  });

  const emailClassName = emailState.touched
    ? emailState.isValid
      ? "is-valid"
      : "is-invalid"
    : "";

  const passwordClassName = passwordState.touched
    ? passwordState.isValid
      ? "is-valid"
      : "is-invalid"
    : "";

  const signinHandler = (event) => {
    event.preventDefault();
    dispatchEmail({ type: "INPUT_VALIDATION" });
    dispatchPassword({ type: "INPUT_VALIDATION" });

    if (emailState.isValid && passwordState.isValid) {
      props.onSignin({ username: emailState.val, password: passwordState.val });
    }
  };

  return (
    <Card className={classes.signinCard + " py-4 "}>
      <Form className="px-4" onSubmit={(event) => signinHandler(event)}>
        <Form.Group className="mb-3">
          <Form.Label className={classes.formLabel}>
            Email <span className="mandatoryAsterisk">*</span>
          </Form.Label>
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
          <Form.Label  className={classes.formLabel}>
            Mot de passe <span style={{ color: "#D0324B" }}>*</span>
          </Form.Label>
          <Form.Control
            required
            type="password"
            className={passwordClassName}
            placeholder="Votre mot de passe"
            onChange={(e) =>
              dispatchPassword({
                type: "USER_INPUT",
                val: e.target.value,
              })
            }
            minLength={8}
            maxLength={12}
            onBlur={() => dispatchPassword({ type: "INPUT_BLUR" })}
            value={passwordState.val}
          ></Form.Control>
        </Form.Group>
        {props.errorMessage && <p className="error">{props.errorMessage}</p>}
        <Form.Group>
          <Button
            type="submit"
            variant="success"
            className="col-12 btn-fretto"
            disabled={props.isLoading}
          >
            {props.isLoading && <Spinner animation="border" variant="light" />}
            <span className="mx-2">Connexion </span>
          </Button>
        </Form.Group>
      </Form>
    </Card>
  );
};

export default SignInForm;
