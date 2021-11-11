import { useEffect, useReducer, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import useHttp from "../../hooks/use-http";
import { fetchGenders } from "../../lib/genders-api";
import LoadingSpinner from "../loading/LoadingSpinner";
import "./SignUpForm.css";

const validatePhone = (phoneNumber) => {
  const phonePattern = /^[0-9]{8}$/;
  return phonePattern.test(phoneNumber);
};
const validateEmail = (email) => {
  const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  return emailPattern.test(email);
};
const validatePassword = (password) => {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,12}$/;
  return passwordPattern.test(password);
};

const validatePasswordConfirm = (passwordConfirm, password) => {
  return validatePassword(password) && passwordConfirm === password;
};

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
        isValid: state.isValid,
      };

    case "INPUT_VALIDATION":
      return { touched: true, val: state.val, isValid: state.isValid };

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
        isValid: state.isValid,
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
    case "INPUT_VALIDATION":
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
    case "INPUT_VALIDATION":
      return { touched: true, val: state?.val, isValid: state.isValid };
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

const SignUpForm = (props) => {
  const {
    sendRequest: fetchGendersRequest,
    data: gendersData,
    error: fetchGendersError,
    status: fetchGendersStatus,
  } = useHttp(fetchGenders, true);

  useEffect(() => {
    fetchGendersRequest({ locale: "fr_FR" });
  }, [fetchGendersRequest]);

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
  const [iccState, dispatchIcc] = useReducer(iccReducer, {
    touched: false,
    val: "+216",
    isValid: true,
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
  const [checkedTos, setCheckedTos] = useState(true);
  const [checkedNewsletter, setCheckedNewsletter] = useState(true);
  const [isTransporter, setIsTransporter] = useState(false);

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

  const iccClassName =
    iccState && iccState.touched
      ? iccState.val && iccState.isValid
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

  const handleSignup = (event) => {
    event.preventDefault();
    dispatchGender({
      type: "INPUT_VALIDATION",
    });
    dispatchLastname({
      type: "INPUT_VALIDATION",
    });
    dispatchFirstname({
      type: "INPUT_VALIDATION",
    });
    dispatchDateOfBirth({
      type: "INPUT_VALIDATION",
    });
    dispatchEmail({
      type: "INPUT_VALIDATION",
    });
    dispatchIcc({
      type: "INPUT_VALIDATION",
    });
    dispatchPhone({
      type: "INPUT_VALIDATION",
    });
    dispatchPassword({
      type: "INPUT_VALIDATION",
    });
    dispatchPasswordConfirm({
      type: "INPUT_VALIDATION",
    });

    if (
      genderState.isValid &&
      lastnameState.isValid &&
      firstnameState.isValid &&
      birthDateState.isValid &&
      passwordState.isValid &&
      passwordState.isValid &&
      passwordConfirmState.isValid &&
      checkedTos &&
      checkedNewsletter
    ) {
      props.onSignup({
        isTransporter: isTransporter,
        genderId: genderState.val,
        firstname: firstnameState.val,
        lastname: lastnameState.val,
        dateOfBirth: birthDateState.val,
        email: emailState.val,
        icc: iccState.val,
        mobileNumber: phoneState.val,
        userPassword: passwordState.val,
        receiveNewsletter: checkedNewsletter,
      });
    }
  };

  if (fetchGendersStatus === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }
  if (!!fetchGendersError) {
    return <p className="centered focused">{fetchGendersError}</p>;
  }
  if (fetchGendersStatus === "completed") {
    return (
      <Card className="py-4 signup-card ">
        <Form className="px-4" onSubmit={(event) => handleSignup(event)}>
          {props.showTransporterSwitch && (
            <Form.Group className="mb-3">
              <Form.Switch
                type="switch"
                label="Je suis transporteur"
                className="fs-3 fw-bold"
                value={isTransporter}
                onChange={() => setIsTransporter(!isTransporter)}
              />
            </Form.Group>
          )}
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
              value={genderState.val}
            >
              <option key="default" value="">
                Genre
              </option>
              {gendersData.map((gender, index) => (
                <option key={gender.id} value={gender.id}>
                  {gender.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              required={true}
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
                dispatchEmail({
                  type: "USER_INPUT",
                  val: e.target.value,
                })
              }
              onBlur={() => dispatchEmail({ type: "INPUT_BLUR" })}
              value={emailState.val}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Téléphone Mobile</Form.Label>
            <div className="row-group">
              <Form.Select
                style={{ width: "45%" }}
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
              <Form.Control
                style={{ display: "inline" }}
                className={phoneClassName}
                required
                type="number"
                placeholder="Numéro mobile"
                onChange={(e) =>
                  dispatchPhone({
                    type: "USER_INPUT",
                    val: e.target.value,
                  })
                }
                onBlur={() => dispatchPhone({ type: "INPUT_BLUR" })}
                value={phoneState.val}
              ></Form.Control>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              required
              type="password"
              className={passwordClassName}
              placeholder="Votre mot de passe"
              minLength={8}
              maxLength={12}
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
              placeholder="Confirmez votre mot de passe"
              minLength={8}
              maxLength={12}
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
          <Form.Group className="mb-3">
            <Form.Check
              required
              type="checkbox"
              label="J'accepte les conditions d'utilisation du service Fretto."
              className="fs-3"
              checked={checkedTos}
              onChange={() => setCheckedTos(!checkedTos)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              required
              type="checkbox"
              label="J'accepte de recevoir des offres de la part de Fretto et ses partenaires."
              className="fs-3"
              checked={checkedNewsletter}
              onChange={() => setCheckedNewsletter(!checkedNewsletter)}
            />
          </Form.Group>
          {props.errorMessage && <p className="error">{props.errorMessage}</p>}
          <Form.Group as={Row}>
            <Col>
              <Button
                type="submit"
                variant="success"
                className="col-12 py-3 fs-2 mt-4 fw-bold"
                disabled={props.isLoading || !checkedNewsletter || !checkedTos}
              >
                {props.isLoading && (
                  <Spinner animation="border" variant="light" />
                )}
                <span className="mx-2">Inscription </span>
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card>
    );
  }
};

export default SignUpForm;
