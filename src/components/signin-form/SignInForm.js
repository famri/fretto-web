import { useReducer } from "react";
import { Button, Card, Form, Spinner ,Col} from "react-bootstrap";
import "./SignInForm.css";

const validateEmail = (email) => {
  const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  return emailPattern.test(email);
};

const validatePassword = (password) => {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,12}$/;
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
    <Card className="py-4 signin-card">
      <Form className="px-4" onSubmit={(event) => signinHandler(event)}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
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
          <Form.Label>Mot de passe</Form.Label>
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
          <Col>
            <Button
              type="submit"
              variant="success"
              className="col-12 py-3 fs-2 mt-4 fw-bold"
              disabled={props.isLoading}
            >
              {props.isLoading && (
                <Spinner animation="border" variant="light" />
              )}
              <span className="mx-2">Connexion </span>
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </Card>
  );
};

export default SignInForm;
