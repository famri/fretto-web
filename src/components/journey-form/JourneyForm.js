import { useEffect, useReducer, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Icon from "../widgets/Icon";
import "./JourneyForm.css";
import ContactForm from "../contact-form/ContactForm";
import Card from "react-bootstrap/Card";
const maxDate = () => {
  var maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  return maxDate;
};
const calculatePlaceName = (suggestion) => {
  if (suggestion.type === "DELEGATION") {
    return (
      suggestion.name + ", " + suggestion.department + ", " + suggestion.country
    );
  } else if (suggestion.type === "DEPARTMENT") {
    return suggestion.name + ", " + suggestion.country;
  } else {
    return (
      suggestion.name +
      ", " +
      suggestion.delegation +
      ", " +
      suggestion.department +
      ", " +
      suggestion.country
    );
  }
};

const fetchSuggestions = async (text) => {
  const loadedSuggestions = [];
  const suggestionsResponse = await fetch(
    "https://192.168.50.4:8443/wamya-backend/places?lang=fr_FR&input=" +
      text +
      "&country=TN"
  );

  if (!suggestionsResponse.ok) {
    throw new Error(
      "Problème de connexion au serveur. Merci de ressayer plus tard."
    );
  }
  const suggestionData = await suggestionsResponse.json();
  console.log(suggestionData);
  suggestionData["content"].map((obj) => loadedSuggestions.push(obj));

  return loadedSuggestions;
};

const placeReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT":
      return {
        val: action.val,
        showSuggestion: action.val.length >= 3,
        isTouched: true,
        isValid: false,
        suggestionChoice: null,
      };

    case "USER_CLICK":
      return {
        val: calculatePlaceName(action.suggestion),
        showSuggestion: false,
        isTouched: true,
        isValid: true,
        suggestionChoice: action.suggestion,
      };

    case "INPUT_BLUR":
      return {
        val: state.val,
        showSuggestion: false,
        isTouched: true,
        isValid: state.suggestionChoice !== null,
        suggestionChoice: state.suggestionChoice,
      };
    case "INPUT_VALIDATION":
      return {
        val: state.val,
        showSuggestion: false,
        isTouched: true,
        isValid: state.suggestionChoice !== null,
        suggestionChoice: state.suggestionChoice,
      };
    default:
      throw new Error();
  }
};

const vehiculeReducer = (state, action) => {
  switch (action.type) {
    case "MENU_OPENED":
      return {
        touched: true,
        val: state.val,
        isValid: state.isValid,
      };

    case "VEHICULE_CHOSEN":
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

const dateReducer = (state, action) => {
  switch (action.type) {
    case "DATE_OPENED":
      return {
        touched: true,
        val: state?.val,
        isValid: state.isValid,
      };
    case "DATE_CHOSEN":
      return {
        touched: true,
        val: action.val,
        isValid: true,
      };
    case "DATE_BLUR":
      return { touched: true, val: state?.val, isValid: state.isValid };
    case "INPUT_VALIDATION":
      return { touched: true, val: state?.val, isValid: state.isValid };
    default:
      throw new Error();
  }
};
const timeReducer = (state, action) => {
  switch (action.type) {
    case "TIME_OPENED":
      return {
        touched: true,
        val: state?.val,
        isValid: state.isValid,
      };
    case "TIME_CHOSEN":
      return {
        touched: true,
        val: action.val,
        isValid: true,
      };
    case "TIME_BLUR":
      return { touched: true, val: state?.val, isValid: state.isValid };
    case "INPUT_VALIDATION":
      return { touched: true, val: state?.val, isValid: state.isValid };
    default:
      throw new Error();
  }
};

const descriptionReducer = (state, action) => {
  switch (action.type) {
    case "DESCRIPTION_TOUCHED":
      return {
        touched: true,
        val: action?.val,
        isValid: action.val.length > 6,
      };

    case "DESCRIPTION_BLUR":
      return { touched: true, val: state?.val, isValid: state.isValid };
    case "INPUT_VALIDATION":
      return { touched: true, val: state?.val, isValid: state.isValid };
    default:
      throw new Error();
  }
};

const departureInitialState = {
  val: "",
  showSuggestion: false,
  isTouched: false,
  isValid: false,
  suggestionChoice: null,
};

const arrivalInitialState = {
  val: "",
  showSuggestion: false,
  isTouched: false,
  isValid: false,
  suggestionChoice: null,
};

const vehiculeInitialState = {
  touched: false,
  val: "",
  isValid: false,
};
const JourneyForm = () => {
  const [departureState, dispatchDeparture] = useReducer(
    placeReducer,
    departureInitialState
  );
  const [arrivalState, dispatchArrival] = useReducer(
    placeReducer,
    arrivalInitialState
  );
  const [vehiculeState, dispatchVehicule] = useReducer(
    vehiculeReducer,
    vehiculeInitialState
  );
  const [dateState, dispatchDate] = useReducer(dateReducer, {
    touched: false,
    val: "",
    isValid: false,
  });
  const [timeState, dispatchTime] = useReducer(timeReducer, {
    touched: false,
    val: "",
    isValid: false,
  });
  const [descriptionState, dispatchDescription] = useReducer(
    descriptionReducer,
    {
      touched: false,
      val: "",
      isValid: false,
    }
  );

  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [arrivalSuggestions, setArrivalSuggestions] = useState([]);

  const [engineTypes, setEngineTypes] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [httpError, setHttpError] = useState();
  const [showContact, setShowContact] = useState(false);

  const handleCloseContact = () => {
    setShowContact(false);
  };

  const handleShowContact = () => {
    setShowContact(true);
  };

  const handleSubmitContact = (email, phone) => {
    setShowContact(false);
    return true;
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();
    dispatchDeparture({ type: "INPUT_VALIDATION" });
    dispatchArrival({ type: "INPUT_VALIDATION" });
    dispatchVehicule({ type: "INPUT_VALIDATION" });
    dispatchDate({ type: "INPUT_VALIDATION" });
    dispatchTime({ type: "INPUT_VALIDATION" });
    dispatchDescription({ type: "INPUT_VALIDATION" });

    if (
      departureState.isValid &&
      arrivalState.isValid &&
      vehiculeState.isValid &&
      dateState.isValid &&
      timeState.isValid &&
      descriptionState.isValid
    ) {
      handleShowContact();
    }
  };

  useEffect(() => {
    async function fetchDepartureSuggestions() {
      try {
        let suggestions = await fetchSuggestions(departureState.val);
        setDepartureSuggestions(suggestions);
      } catch (error) {
        setHttpError(error.message);
      }
    }

    if (departureState.val.length >= 3 && departureState.showSuggestion) {
      fetchDepartureSuggestions();
    }
  }, [departureState.showSuggestion, departureState.val]);

  useEffect(() => {
    async function fetchArrivalSuggestions() {
      try {
        let suggestions = await fetchSuggestions(arrivalState.val);
        setArrivalSuggestions(suggestions);
      } catch (error) {
        setHttpError(error.message);
      }
    }
    if (arrivalState.val.length >= 3 && arrivalState.showSuggestion) {
      fetchArrivalSuggestions();
    }
  }, [arrivalState.showSuggestion, arrivalState.val]);

  useEffect(() => {
    const fetchEngineTypes = async () => {
      try {
        const engineTypesResponse = await fetch(
          "https://192.168.50.4:8443/wamya-backend/engine-types?lang=fr_FR"
        );
        const responseData = await engineTypesResponse.json();
        const loadedEngineTypes = [];
        responseData["content"].map((obj) => loadedEngineTypes.push(obj));

        setEngineTypes(loadedEngineTypes);
      } catch (error) {
        setHttpError(
          "Problème de connexion au serveur. Merci de réessayer plus tard."
        );
      }
      setIsLoading(false);
    };

    fetchEngineTypes();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (httpError) {
    return <section className="api-error">{httpError}</section>;
  }

  const engineTypeClassName =
    vehiculeState && vehiculeState.touched
      ? vehiculeState.val && vehiculeState.val !== ""
        ? "is-valid"
        : "is-invalid"
      : "";

  const dateClassName =
    dateState && dateState.touched
      ? dateState.val
        ? "is-valid"
        : "is-invalid"
      : "";

  const timeClassName =
    timeState && timeState.touched
      ? timeState.val
        ? "is-valid"
        : "is-invalid"
      : "";

  const descriptionClassName =
    descriptionState && descriptionState.touched
      ? descriptionState.val && descriptionState.val.length > 5
        ? "is-valid"
        : "is-invalid"
      : "";

  return (
    <Card className="journey-card py-3 px-3">
      <Form onSubmit={(event) => formSubmissionHandler(event)}>
        <Form.Group className="mb-3 autocomplete" controlId="formDeparture">
          <Form.Label className="form-label">Ville de départ</Form.Label>

          <Form.Control
            type="text"
            required
            className={
              departureState.isTouched
                ? departureState.isValid
                  ? "is-valid"
                  : "is-invalid"
                : ""
            }
            placeholder="Ville de départ"
            onChange={(e) =>
              dispatchDeparture({ type: "USER_INPUT", val: e.target.value })
            }
            onBlur={() => dispatchDeparture({ type: "INPUT_BLUR" })}
            value={departureState.val}
          />

          {departureState.showSuggestion && departureSuggestions.length > 0 && (
            <div className="suggestion">
              {departureSuggestions.map((suggestion, i) => {
                return (
                  <div
                    key={suggestion.id}
                    onMouseDown={() =>
                      dispatchDeparture({
                        type: "USER_CLICK",
                        suggestion: suggestion,
                      })
                    }
                  >
                    {calculatePlaceName(suggestion)}
                  </div>
                );
              })}
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3 autocomplete" controlId="formArrival">
          <Form.Label className="form-label">Ville d'arrivée</Form.Label>

          <Form.Control
            type="text"
            required
            className={
              arrivalState.isTouched
                ? arrivalState.isValid
                  ? "is-valid"
                  : "is-invalid"
                : ""
            }
            placeholder="Ville de départ"
            onChange={(e) =>
              dispatchArrival({ type: "USER_INPUT", val: e.target.value })
            }
            onBlur={() => dispatchArrival({ type: "INPUT_BLUR" })}
            value={arrivalState.val}
          />

          {arrivalState.showSuggestion && arrivalSuggestions.length > 0 && (
            <div className="suggestion">
              {arrivalSuggestions.map((suggestion, i) => {
                return (
                  <div
                    key={suggestion.id}
                    onMouseDown={() =>
                      dispatchArrival({
                        type: "USER_CLICK",
                        suggestion: suggestion,
                      })
                    }
                  >
                    {calculatePlaceName(suggestion)}
                  </div>
                );
              })}
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3 " controlId="formEngineType">
          <Form.Label className="form-label">Véhicule</Form.Label>
          <div
            style={{
              display:
                vehiculeState.val !== undefined &&
                vehiculeState.val.toLowerCase() !== ""
                  ? "block"
                  : "none",
            }}
          >
            <Icon
              name={vehiculeState.val.toLowerCase()}
              color="white"
              size={50}
            />
          </div>
          <Form.Select
            className={engineTypeClassName}
            required
            onChange={(event) =>
              dispatchVehicule({
                type: "VEHICULE_CHOSEN",
                val: event.target.value,
              })
            }
            onClick={(event) =>
              dispatchVehicule({
                type: "MENU_OPENED",
              })
            }
            onBlur={(event) =>
              dispatchVehicule({
                type: "MENU_BLUR",
              })
            }
          >
            <option key="default" value="">
              Choisissez un véhicule
            </option>
            {engineTypes.map((engineType, index) => (
              <option key={engineType.id} value={engineType.code}>
                {engineType.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDate">
          <Form.Label className="form-label">Date</Form.Label>

          <Form.Control
            required
            className={dateClassName}
            type="date"
            min={new Date().toISOString().split("T")[0]}
            max={maxDate().toISOString().split("T")[0]}
            placeholder="Date"
            value={dateState?.val}
            onClick={(event) =>
              dispatchDate({
                type: "DATE_OPENED",
              })
            }
            onChange={(e) =>
              dispatchDate({
                type: "DATE_CHOSEN",
                val: e.target.value,
              })
            }
            onBlur={(e) =>
              dispatchDate({
                type: "DATE_BLUR",
                val: e.target.value,
              })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3 " controlId="formTime">
          <Form.Label className="form-label">Heure</Form.Label>

          <Form.Control
            required
            className={timeClassName}
            type="time"
            placeholder="Date"
            value={timeState.val}
            onClick={(event) =>
              dispatchTime({
                type: "TIME_OPENED",
              })
            }
            onChange={(e) =>
              dispatchTime({
                type: "TIME_CHOSEN",
                val: e.target.value,
              })
            }
            onBlur={(e) =>
              dispatchTime({
                type: "TIME_BLUR",
                val: e.target.value,
              })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label className="form-label">Description</Form.Label>

          <Form.Control
            required
            className={descriptionClassName}
            value={descriptionState.val}
            onChange={(e) =>
              dispatchDescription({
                type: "DESCRIPTION_TOUCHED",
                val: e.target.value,
              })
            }
            onBlur={(e) =>
              dispatchDescription({
                type: "DESCRIPTION_BLUR",
                val: e.target.value,
              })
            }
            as="textarea"
            rows={3}
            placeholder="Décrivez votre demande: que voulez vous transporter? poids approximatif, etc"
          />
        </Form.Group>

        <Form.Group as={Row}>
          <Col>
            <Button type="submit" className="btn-success col-12 py-3 fs-2">
              Obtenir mes devis
            </Button>
          </Col>
        </Form.Group>
      </Form>
      <ContactForm
        show={showContact}
        handleClose={handleCloseContact}
        handleSubmit={handleSubmitContact}
      ></ContactForm>
    </Card>
  );
};

export default JourneyForm;
