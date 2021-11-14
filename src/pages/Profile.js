import { useContext, useEffect, useReducer, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import useHttp from "../hooks/use-http";
import { fetchGenders } from "../lib/genders-api";
import { loadProfileInfo } from "../lib/profile-api";
import AuthContext from "../store/auth-context";
import classes from "./Profile.module.css";

const validateDate = (dateString) => {
  const datePattern = /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/;
  return datePattern.test(dateString);
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
const maxDateOfBirth = () => {
  var maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() - 18);
  return maxDate;
};
const Profile = () => {
  const authContext = useContext(AuthContext);

  const {
    sendRequest: fetchGendersRequest,
    data: gendersData,
    error: fetchGendersError,
    status: fetchGendersStatus,
  } = useHttp(fetchGenders, true);

  const [editAboutSection, setEditAboutSection] = useState(false);

  const {
    sendRequest: sendLoadProfileInfo,
    status,
    data,
    error,
  } = useHttp(loadProfileInfo, true);

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
  const handleAboutSectionSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    sendLoadProfileInfo({ token: authContext.token, locale: "fr_FR" });
    fetchGendersRequest({ locale: "fr_FR" });
  }, [sendLoadProfileInfo, fetchGendersRequest, authContext.token]);

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
  if (status === "pending" || fetchGendersStatus === "pending") {
    return (
      <Container className="d-flex justify-content-center my-auto">
        <LoadingSpinner></LoadingSpinner>
      </Container>
    );
  }
  if (!!error) {
    return (
      <h1 className="error d-flex justify-content-center my-auto">{error}</h1>
    );
  }

  if (!!fetchGendersError) {
    return (
      <h1 className="error d-flex justify-content-center my-auto">
        {fetchGendersError}
      </h1>
    );
  }
  if (status === "completed" && fetchGendersStatus === "completed")
    return (
      <Container>
        <Card>
          <Card.Header className="d-flex justify-content-center">
            <Row xs={1} md={1}>
              <Col className="d-flex justify-content-center">
                <img
                  alt={"user-profile"}
                  src={data.photoUrl}
                  className={classes.bigAvatar}
                ></img>
              </Col>
              <Col className="d-flex justify-content-center">
                <span className={classes.userName + " fs-2 ml-5"}>
                  {data.name.firstname + " " + data.name.lastname.toUpperCase()}
                </span>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Card>
              <Card.Header className="fs-2 fw-bold">
                <div className="d-flex justify-content-between">
                  <h1>À Propos</h1>
                  <Button
                    className="fs-2"
                    onClick={() => {
                      setEditAboutSection(!editAboutSection);
                    }}
                  >
                    {!editAboutSection ? "Editer" : "Sauvegarder"}
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Form
                  onSubmit={(event) => {
                    handleAboutSectionSubmit(event);
                  }}
                >
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
                      value={
                        editAboutSection && genderState.touched
                          ? genderState.val
                          : data.gender.id
                      }
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
                      disabled={!editAboutSection}
                      required={true}
                      type="text"
                      className={lastnameClassName}
                      value={
                        editAboutSection && lastnameState.touched
                          ? lastnameState.val
                          : data.name.lastname.toUpperCase()
                      }
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
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      disabled={!editAboutSection}
                      required
                      type="text"
                      className={firstnameClassName}
                      value={
                        editAboutSection && firstnameState.touched
                          ? firstnameState.val
                          : data.name.lastname
                      }
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
                    <Form.Label>Date de naissance</Form.Label>
                    <Form.Control
                      disabled={!editAboutSection}
                      required
                      type="date"
                      className={dateOfBirthClassName}
                      value={
                        editAboutSection && birthDateState.touched
                          ? birthDateState.val
                          : data.dateOfBirth
                      }
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
                </Form>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Container>
    );
};

export default Profile;
