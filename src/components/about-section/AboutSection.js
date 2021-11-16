import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useReducer, useState } from "react";
import {
    Button,
    Card,
    Container,
    Form, OverlayTrigger, Tooltip
} from "react-bootstrap";
import useHttp from "../../hooks/use-http";
import { fetchGenders } from "../../lib/genders-api";
import { updateAboutSection } from "../../lib/profile-api";
import AuthContext from "../../store/auth-context";
import LoadingSpinner from "../loading/LoadingSpinner";

const validateDate = (dateString) => {
  const datePattern = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
  return datePattern.test(dateString);
};

const maxDateOfBirth = () => {
  var maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() - 18);
  return maxDate;
};

const genderReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        touched: false,
        val: action.val,
        isValid: true,
      };

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

const nameReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        touched: false,
        val: action.val,
        isValid: true,
      };

    case "NAME_TOUCHED":
      return {
        touched: true,
        val: action.val,
        isValid: action.val.length >= 3,
      };

    case "NAME_BLUR":
      return { touched: true, val: state.val, isValid: state.isValid };
    case "INPUT_VALIDATION":
      return { touched: true, val: state.val, isValid: state.isValid };
    default:
      throw new Error();
  }
};

const minibioReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        touched: false,
        val: action.val || "",
        isValid:
          action.val && action.val.length >= 6 && action.val.length <= 150,
      };
    case "MINIBIO_TOUCHED":
      return {
        touched: true,
        val: action.val,
        isValid: action.val.length >= 6 && action.val.length <= 150,
      };

    case "MINIBIO_BLUR":
      return { touched: true, val: state.val, isValid: state.isValid };
    case "INPUT_VALIDATION":
      return { touched: true, val: state.val, isValid: state.isValid };
    default:
      throw new Error();
  }
};

const dateOfBirthReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        touched: false,
        val: action.val,
        isValid: true,
      };
    case "BIRTH_DATE_TOUCHED":
      return {
        touched: true,
        val: action.val,
        isValid: validateDate(action.val),
      };

    case "BIRTH_DATE_BLUR":
      return { touched: true, val: state.val, isValid: state.isValid };
    case "INPUT_VALIDATION":
      return { touched: true, val: state.val, isValid: state.isValid };
    default:
      throw new Error();
  }
};

const AboutSection = (props) => {
  const authContext = useContext(AuthContext);
  const [editAboutSection, setEditAboutSection] = useState(false);

  const [genderState, dispatchGender] = useReducer(genderReducer, {
    touched: false,
    val: props.aboutData.genderId,
    isValid: true,
  });

  const [lastnameState, dispatchLastname] = useReducer(nameReducer, {
    touched: false,
    val: props.aboutData.lastname,
    isValid: true,
  });

  const [firstnameState, dispatchFirstname] = useReducer(nameReducer, {
    touched: false,
    val: props.aboutData.firstname,
    isValid: true,
  });

  const [birthDateState, dispatchDateOfBirth] = useReducer(dateOfBirthReducer, {
    touched: false,
    val: props.aboutData.dateOfBirth,
    isValid: true,
  });

  const [minibioState, dispatchMinibio] = useReducer(minibioReducer, {
    touched: false,
    val: props.aboutData.minibio,
    isValid:
      props.aboutData.minibio &&
      props.aboutData.minibio.length >= 6 &&
      props.aboutData.minibio <= 150,
  });

  const [updateAboutSectionError, setUpdateAboutSectionError] = useState();

  const {
    sendRequest: fetchGendersRequest,
    data: gendersData,
    error: fetchGendersError,
    status: fetchGendersStatus,
  } = useHttp(fetchGenders, true);

  useEffect(() => {
    fetchGendersRequest({ locale: "fr_FR" });
  }, [fetchGendersRequest]);

  const handleSave = () => {
    dispatchGender({ type: "INPUT_VALIDATION" });
    dispatchFirstname({ type: "INPUT_VALIDATION" });
    dispatchLastname({ type: "INPUT_VALIDATION" });
    dispatchDateOfBirth({ type: "INPUT_VALIDATION" });
    dispatchMinibio({ type: "INPUT_VALIDATION" });

    if (
      genderState.isValid &&
      firstnameState.isValid &&
      lastnameState.isValid &&
      birthDateState.isValid &&
      minibioState.isValid
    ) {
      updateAboutSection({
        genderId: genderState.val,
        firstname: firstnameState.val,
        lastname: lastnameState.val,
        dateOfBirth: birthDateState.val,
        minibio: minibioState.val,
        token: authContext.token,
      })
        .then(() => {
          setEditAboutSection(false);
          props.afterUpdateCallback();
        })
        .catch((updateAboutSectionError) => {
          setUpdateAboutSectionError(updateAboutSectionError);
        });
    }
  };

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
  const minibioClassName = editAboutSection
    ? minibioState && minibioState.touched
      ? minibioState.val && minibioState.isValid
        ? "is-valid"
        : "is-invalid"
      : ""
    : "";

  if (fetchGendersStatus === "pending") {
    return (
      <Container className="d-flex justify-content-center my-auto">
        <LoadingSpinner></LoadingSpinner>
      </Container>
    );
  }

  if (!!fetchGendersError) {
    return (
      <h1 className="error d-flex justify-content-center my-auto">
        {fetchGendersError}
      </h1>
    );
  }

  if (fetchGendersStatus === "completed") {
    return (
      <Card>
        <Card.Header className="fs-2 fw-bold">
          <div className="d-flex justify-content-between">
            <h1>À Propos</h1>
            <Button
              className="fs-2"
              onClick={() => {
                !editAboutSection
                  ? setEditAboutSection(!editAboutSection)
                  : handleSave();
              }}
            >
              {!editAboutSection ? "Editer" : "Sauvegarder"}
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {updateAboutSectionError && !!updateAboutSectionError.message && (
            <h1 className="d-flex justify-content-center error">
              {updateAboutSectionError.message}
            </h1>
          )}
          <Form>
            <Form.Group>
              <Form.Label className="fs-2">Genre</Form.Label>

              <Form.Select
                disabled={!editAboutSection}
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
              <Form.Label className="fs-2">Nom</Form.Label>
              <Form.Control
                disabled={!editAboutSection}
                required={true}
                type="text"
                className={lastnameClassName}
                value={lastnameState.val.toUpperCase()}
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
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fs-2">Prénom</Form.Label>
              <Form.Control
                disabled={!editAboutSection}
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
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fs-2">Date de naissance</Form.Label>
              <Form.Control
                disabled={!editAboutSection}
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
              <Form.Label className="fs-2">Minibio</Form.Label>
              <Form.Control
                disabled={!editAboutSection}
                type="text"
                rows={3}
                as={"textarea"}
                className={minibioClassName}
                value={minibioState.val}
                onChange={(e) =>
                  dispatchMinibio({
                    type: "MINIBIO_TOUCHED",
                    val: e.target.value,
                  })
                }
                onBlur={(e) =>
                  dispatchMinibio({
                    type: "MINIBIO_BLUR",
                    val: e.target.value,
                  })
                }
              ></Form.Control>
            </Form.Group>
          </Form>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end">
          <div className="my-3">
            {props.aboutData.validationInfo.isValidated && (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip className="fs-2 ">Idenditée vérifée</Tooltip>}
              >
                <Button variant="light">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size="3x"
                    color="#B3CE55"
                  />
                </Button>
              </OverlayTrigger>
            )}
            {!props.aboutData.validationInfo.isValidated && (
              <Button variant="success" className="fs-2 fw-bold ">
                Faire valider mon identité
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
    );
  }
};

export default AboutSection;
