import { useEffect, useReducer } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/logos/fretto_logo.png";
import Footer from "../components/footer/Footer";
import "./SignIn.css";
import useHttp from "../hooks/use-http";
import { signinFunction } from "../lib/authentication-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import AuthContext from "../store/auth-context";

const validateEmail = (email) => {
  const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  return emailPattern.test(email);
};

const validatePassword = (password) => {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,64}$/;
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

const SignIn = () => {
  const history = useHistory();

  const authCtx = useContext(AuthContext);
  const [sendRequest, status, data, error] = useHttp(signinFunction);

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
    dispatchEmail({ type: "INPUT_VALIDATION" });
    dispatchPassword({ type: "INPUT_VALIDATION" });

    if (emailState.isValid && passwordState.isValid) {
      sendRequest({ username: emailState.val, password: passwordState.val });
    }
  };

  useEffect(() => {
    if (status === "completed") {
      if (!!error) {
      } else {
        authCtx.login(data.token, data.expiresInMs);
        history.push("/journey-requests");
      }
    }
  }, [status, error, history]);

  return (
    <Container fluid className="signin-container">
      <Row className="justify-content-md-center">
        <Col md={3}>
          <div className="py-5">
            <div className="text-center">
              <img src={logo} alt="flutter_logo" width="170px"></img>
            </div>
            <h2 className="text-center py-2 fs-1">Heureux de vous revoir !</h2>
            <div className="text-center">
              <span className="fs-5">Pas encore inscrit sur Fretto ? </span>
              <Link to="/signup" className="link-dark">
                Inscription
              </Link>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={3}>
          <Card className="py-4 signin-card">
            <Form className="px-4" onSubmit={(event) => signinHandler()}>
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
                  onBlur={() => dispatchPassword({ type: "INPUT_BLUR" })}
                  value={passwordState.val}
                ></Form.Control>
              </Form.Group>
              {error && (
                <h1 style={{ color: "red" }}>
                  {
                    "Echec de la connexion. Vérifiez votre login et mot de passe."
                  }
                </h1>
              )}
              <Form.Group as={Row}>
                <Col>
                  <Button
                    type="submit"
                    variant="success"
                    className="col-12 py-3 fs-2 mt-4"
                    disabled={status === "pending"}
                  >
                    {status === "pending" ? (
                      <>
                        <FontAwesomeIcon
                          icon="spinner"
                          spin="true"
                        ></FontAwesomeIcon>
                        <span> "Connexion..."</span>
                      </>
                    ) : (
                      <span> "Connexion"</span>
                    )}
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </Card>
        </Col>
      </Row>
      <Footer></Footer>
    </Container>
  );
};

export default SignIn;
