import { useReducer } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logos/fretto_logo.png";
import Footer from "../components/footer/Footer";
import "./SignUp.css";

const maxDateOfBirth = () => {
  var maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() - 18);
  return maxDate;
};
const genderReducer = (state, action) => {
  switch (action.type) {
    case "MENU_OPENED":
      return {
        touched: true,
        val: state.val,
        isValid: state.isValid,
      };

    case "GENDER_CHOSEN":
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
const nameReducer = (state, action) => {
  switch (action.type) {
    case "NAME_TOUCHED":
      return {
        touched: true,
        val: action?.val,
        isValid: action.val.length >= 3,
      };

    case "NAME_BLUR":
      return { touched: true, val: state?.val, isValid: state.isValid };
    case "NAME_VALIDATION":
      return { touched: true, val: state?.val, isValid: state.isValid };
    default:
      throw new Error();
  }
};
const dateOfBirthReducer = (state, action) => {
  switch (action.type) {
    case "BIRTH_DATE_TOUCHED":
      return {
        touched: true,
        val: action?.val,
        isValid: action.val.length > 6,
      };

    case "BIRTH_DATE_BLUR":
      return { touched: true, val: state?.val, isValid: state.isValid };
    case "BIRTH_DATE_VALIDATION":
      return { touched: true, val: state?.val, isValid: state.isValid };
    default:
      throw new Error();
  }
};
const validateEmail = (email) => {
  const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  return emailPattern.test(email);
};

const validatePhone = (phoneNumber) => {
  const phonePattern = /^[0-9]{8}$/;
  return phonePattern.test(phoneNumber);
};
const validatePassword = (password) => {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,64}$/;
  return passwordPattern.test(password);
};

const validatePasswordConfirm = (passwordConfirm, password) => {
  return validatePassword(password) && passwordConfirm === password;
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

const SignUp = () => {
  const passwordConfirmReducer = (state, action) => {
    switch (action.type) {
      case "USER_INPUT":
        return {
          touched: true,
          val: action.val,
          isValid: validatePasswordConfirm(action.val, passwordState.val),
        };
      case "INPUT_BLUR":
        return {
          touched: state.touched,
          val: state.val,
          isValid: validatePasswordConfirm(state.val, passwordState.val),
        };
      case "INPUT_VALIDATION":
        return {
          touched: true,
          val: state.val,
          isValid: validatePasswordConfirm(state.val, passwordState.val),
        };
      default:
        throw new Error();
    }
  };

  const [genderState, dispatchGender] = useReducer(genderReducer, {
    touched: false,
    val: "",
    isValid: false,
  });
  const [lastnameState, dispatchLastname] = useReducer(nameReducer, {
    touched: false,
    val: "",
    isValid: false,
  });
  const [firstnameState, dispatchFirstname] = useReducer(nameReducer, {
    touched: false,
    val: "",
    isValid: false,
  });
  const [birthDateState, dispatchDateOfBirth] = useReducer(dateOfBirthReducer, {
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
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    touched: false,
    val: "",
    isValid: false,
  });
  const [passwordConfirmState, dispatchPasswordConfirm] = useReducer(
    passwordConfirmReducer,
    {
      touched: false,
      val: "",
      isValid: false,
    }
  );

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

  const passwordClassName = passwordState.touched
    ? passwordState.isValid
      ? "is-valid"
      : "is-invalid"
    : "";

  const passwordConfirmClassName = passwordConfirmState.touched
    ? passwordConfirmState.isValid
      ? "is-valid"
      : "is-invalid"
    : "";

  const genderClassName =
    genderState && genderState.touched
      ? genderState.val && genderState.isValid
        ? "is-valid"
        : "is-invalid"
      : "";
  const lastnameClassName =
    lastnameState && lastnameState.touched
      ? lastnameState.val && lastnameState.isValid
        ? "is-valid"
        : "is-invalid"
      : "";
  const firstnameClassName =
    firstnameState && firstnameState.touched
      ? firstnameState.val && firstnameState.isValid
        ? "is-valid"
        : "is-invalid"
      : "";
  const dateOfBirthClassName =
    birthDateState && birthDateState.touched
      ? birthDateState.val && birthDateState.isValid
        ? "is-valid"
        : "is-invalid"
      : "";
  return (
    <Container fluid className="signup-container">
      <Row className="justify-content-md-center">
        <Col md={3}>
          <div className="py-5">
            <div className="text-center">
              <img src={logo} alt="flutter_logo" width="170px"></img>
            </div>
            <h2 className="text-center py-2 fs-1">Prêt à nous rejoindre ?</h2>
            <div className="text-center">
              <span className="fs-5">Déjà inscrit sur Fretto ? </span>
              <Link to="/signin" className="link-dark">
                Connexion
              </Link>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={3}>
          <Card className="py-4 signup-card">
            <Form className="px-4">
              <Form.Group className="mb-3">
                <Form.Label>Genre</Form.Label>
                <Form.Select
                  className={genderClassName}
                  required
                  onChange={(event) =>
                    dispatchGender({
                      type: "GENDER_CHOSEN",
                      val: event.target.value,
                    })
                  }
                  onClick={(event) =>
                    dispatchGender({
                      type: "MENU_OPENED",
                    })
                  }
                  onBlur={(event) =>
                    dispatchGender({
                      type: "MENU_BLUR",
                    })
                  }
                >
                  <option key="default" value="">
                    Genre
                  </option>
                  <option key="1" value="1">
                    Homme
                  </option>
                  <option key="2" value="2">
                    Femme
                  </option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  required
                  type="text"
                  className={lastnameClassName}
                  value={lastnameState.val}
                  onChange={(e) =>
                    dispatchLastname({
                      type: "NAME_TOUCHED",
                      val: e.target.value,
                    })
                  }
                  onBlur={(e) =>
                    dispatchLastname({
                      type: "NAME_BLUR",
                      val: e.target.value,
                    })
                  }
                  placeholder="Votre nom"
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  required
                  type="text"
                  className={firstnameClassName}
                  value={firstnameState.val}
                  onChange={(e) =>
                    dispatchFirstname({
                      type: "NAME_TOUCHED",
                      val: e.target.value,
                    })
                  }
                  onBlur={(e) =>
                    dispatchFirstname({
                      type: "NAME_BLUR",
                      val: e.target.value,
                    })
                  }
                  placeholder="Votre prénom"
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date de naissance</Form.Label>
                <Form.Control
                  required
                  type="date"
                  className={dateOfBirthClassName}
                  value={birthDateState.val}
                  max={maxDateOfBirth().toISOString().split("T")[0]}
                  onChange={(e) =>
                    dispatchDateOfBirth({
                      type: "BIRTH_DATE_TOUCHED",
                      val: e.target.value,
                    })
                  }
                  onBlur={(e) =>
                    dispatchDateOfBirth({
                      type: "BIRTH_DATE_BLUR",
                      val: e.target.value,
                    })
                  }
                ></Form.Control>
              </Form.Group>
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
                <Form.Label>Téléphone Mobile</Form.Label>
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
              <Form.Group className="mb-3">
                <Form.Label>Confirmation</Form.Label>
                <Form.Control
                  required
                  type="password"
                  className={passwordConfirmClassName}
                  placeholder="Confirmer votre mot de passe"
                  onChange={(e) =>
                    dispatchPasswordConfirm({
                      type: "USER_INPUT",
                      val: e.target.value,
                    })
                  }
                  onBlur={() => dispatchPasswordConfirm({ type: "INPUT_BLUR" })}
                  value={passwordConfirmState.val}
                ></Form.Control>
              </Form.Group>
              <Form.Group as={Row}>
                <Col>
                  <Button
                    type="submit"
                    variant="success"
                    className="col-12 py-3 fs-2 mt-4"
                  >
                    Inscription
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

export default SignUp;
