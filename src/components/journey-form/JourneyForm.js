import { useEffect, useReducer } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import useHttp from "../../hooks/use-http";
import { fetchEngineTypes } from "../../lib/engine-types-api";
import { fetchSuggestions } from "../../lib/places-api";
import Icon from "../widgets/Icon";
import "./JourneyForm.css";
const validateWorkers = (workers) => {
  const workersPattern = /^[0-3]{1}$/;
  return workersPattern.test(workers);
};
const maxDate = () => {
  var maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  return maxDate;
};
const calculatePlaceName = (suggestion) => {
  if (suggestion.type === "DEPARTMENT") {
    return suggestion.name + ", " + suggestion.country;
  } else if (suggestion.type === "DELEGATION") {
    return (
      suggestion.name + ", " + suggestion.department + ", " + suggestion.country
    );
  } else {
    return (
      suggestion.name + ", " + suggestion.department + ", " + suggestion.country
    );
  }
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
        isValid: state.isValid,
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

const workersReducer = (state, action) => {
  switch (action.type) {
    case "WORKERS_TOUCHED":
      return {
        touched: true,
        val: action?.val,
        isValid: validateWorkers(action?.val),
      };

    case "WORKERS_BLUR":
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

const JourneyForm = (props) => {
  const {
    sendRequest: sendLoadEngineTypesRequest,
    status: loadEngineTypesStatus,
    error: loadEngineTypesError,
    data: loadedEngineTypes,
  } = useHttp(fetchEngineTypes, true);

  const {
    sendRequest: sendLoadDepartureSuggestionsRequest,
    status: loadDepartureSuggestionsStatus,
    error: loadDepartureSuggestionsError,
    data: loadedDepartureSuggestions,
  } = useHttp(fetchSuggestions);

  const {
    sendRequest: sendLoadArrivalSuggestionsRequest,
    status: loadArrivalSuggestionsStatus,
    error: loadArrivalSuggestionsError,
    data: loadedArrivalSuggestions,
  } = useHttp(fetchSuggestions);

  useEffect(() => {
    sendLoadEngineTypesRequest({ language: "fr_FR" });
  }, [sendLoadEngineTypesRequest]);

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
  const [workersState, dispatchWorkers] = useReducer(workersReducer, {
    touched: false,
    val: "0",
    isValid: true,
  });

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

  const formSubmissionHandler = (event) => {
    event.preventDefault();
    dispatchDeparture({ type: "INPUT_VALIDATION" });
    dispatchArrival({ type: "INPUT_VALIDATION" });
    dispatchVehicule({ type: "INPUT_VALIDATION" });
    dispatchWorkers({ type: "INPUT_VALIDATION" });
    dispatchDate({ type: "INPUT_VALIDATION" });
    dispatchTime({ type: "INPUT_VALIDATION" });
    dispatchDescription({ type: "INPUT_VALIDATION" });

    if (
      departureState.isValid &&
      arrivalState.isValid &&
      vehiculeState.isValid &&
      workersState.isValid &&
      dateState.isValid &&
      timeState.isValid &&
      descriptionState.isValid
    ) {
      let journeyDateTime = new Date(
        dateState.val + "T" + timeState.val + ":00.000"
      ).toISOString();
      props.onJourneyRequest({
        departurePlaceId: departureState.suggestionChoice.id,
        departurePlaceType: departureState.suggestionChoice.type,
        arrivalPlaceId: arrivalState.suggestionChoice.id,
        arrivalPlaceType: arrivalState.suggestionChoice.type,
        dateTime: journeyDateTime.substr(0, journeyDateTime.length - 1),
        engineTypeId: loadedEngineTypes.find(
          (e) => e.code === vehiculeState.val
        ).id,
        workers: parseInt(workersState.val),

        description: descriptionState.val,
      });
    }
  };

  useEffect(() => {
    if (departureState.val.length >= 3 && departureState.showSuggestion) {
      sendLoadDepartureSuggestionsRequest({
        text: departureState.val,
        language: "fr_FR",
        country: "TN",
      });
    }
  }, [departureState, sendLoadDepartureSuggestionsRequest]);

  useEffect(() => {
    if (arrivalState.val.length >= 3 && arrivalState.showSuggestion) {
      sendLoadArrivalSuggestionsRequest({
        text: arrivalState.val,
        language: "fr_FR",
        country: "TN",
      });
    }
  }, [arrivalState, sendLoadArrivalSuggestionsRequest]);

  const engineTypeClassName =
    vehiculeState && vehiculeState.touched
      ? vehiculeState.val && vehiculeState.val !== ""
        ? "is-valid"
        : "is-invalid"
      : "";

  const dateClassName =
    dateState && dateState.touched
      ? dateState.isValid
        ? "is-valid"
        : "is-invalid"
      : "";
  const workersClassName =
    workersState && workersState.touched
      ? workersState.isValid
        ? "is-valid"
        : "is-invalid"
      : "";

  const timeClassName =
    timeState && timeState.touched
      ? timeState.isValid
        ? "is-valid"
        : "is-invalid"
      : "";

  const descriptionClassName =
    descriptionState && descriptionState.touched
      ? descriptionState.val && descriptionState.val.length > 5
        ? "is-valid"
        : "is-invalid"
      : "";

  useEffect(() => {}, [
    loadDepartureSuggestionsStatus,
    loadedDepartureSuggestions,
    loadDepartureSuggestionsError,
    loadArrivalSuggestionsStatus,
    loadedArrivalSuggestions,
    loadArrivalSuggestionsError,
  ]);

  if (loadEngineTypesStatus === "pending") {
    return <Spinner variant="warning" animation="grow"></Spinner>;
  }

  if (!!loadEngineTypesError) {
    return <h1>{loadEngineTypesError}</h1>;
  }
  if (loadEngineTypesStatus === "completed") {
    return (
      <Card className="journey-card py-3 px-3">
        <Form onSubmit={(event) => formSubmissionHandler(event)}>
          <Form.Group className="mb-3 autocomplete" controlId="formDeparture">
            <Form.Label className="form-label">Ville de départ <span style={{ color: "#D0324B" }}>*</span></Form.Label>

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
                dispatchDeparture({
                  type: "USER_INPUT",
                  val: e.target.value,
                })
              }
              onBlur={() => dispatchDeparture({ type: "INPUT_BLUR" })}
              value={departureState.val}
            />
            {departureState.showSuggestion &&
              loadDepartureSuggestionsStatus === "completed" &&
              !!loadDepartureSuggestionsError && (
                <div className="suggestion">
                  <p>{loadDepartureSuggestionsError}</p>
                </div>
              )}
            {departureState.showSuggestion &&
              loadDepartureSuggestionsStatus === "completed" &&
              loadedDepartureSuggestions.length > 0 && (
                <div className="suggestion">
                  {loadedDepartureSuggestions.map((suggestion, i) => {
                    return (
                      <p
                        key={suggestion.id}
                        onMouseDown={() =>
                          dispatchDeparture({
                            type: "USER_CLICK",
                            suggestion: suggestion,
                          })
                        }
                      >
                        {calculatePlaceName(suggestion)}
                      </p>
                    );
                  })}
                </div>
              )}
          </Form.Group>
          <Form.Group className="mb-3 autocomplete" controlId="formArrival">
            <Form.Label className="form-label">Ville d'arrivée <span style={{ color: "#D0324B" }}>*</span></Form.Label>

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
              placeholder="Ville d'arrivée"
              onChange={(e) =>
                dispatchArrival({ type: "USER_INPUT", val: e.target.value })
              }
              onBlur={() => dispatchArrival({ type: "INPUT_BLUR" })}
              value={arrivalState.val}
            />
            {arrivalState.showSuggestion &&
              loadArrivalSuggestionsStatus === "completed" &&
              !!loadArrivalSuggestionsError && (
                <div className="suggestion">
                  <p>{loadArrivalSuggestionsError}</p>
                </div>
              )}
            {arrivalState.showSuggestion &&
              loadArrivalSuggestionsStatus === "completed" &&
              loadedArrivalSuggestions.length > 0 && (
                <div className="suggestion">
                  {loadedArrivalSuggestions.map((suggestion, i) => {
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
            <Form.Label className="form-label">Véhicule <span style={{ color: "#D0324B" }}>*</span></Form.Label>
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
                color="#D0324B"
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
              {loadedEngineTypes.map((engineType, index) => (
                <option key={engineType.id} value={engineType.code}>
                  {engineType.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formWorkers">
            <Form.Label className="form-label">
              Main d'oeuvre (personnes)
            </Form.Label>

            <Form.Control
              required
              className={workersClassName}
              type="number"
              min={0}
              max={3}
              placeholder="nombre de manutentionnaires"
              value={workersState?.val}
              onChange={(e) =>
                dispatchWorkers({
                  type: "WORKERS_TOUCHED",
                  val: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatchWorkers({
                  type: "WORKERS_BLUR",
                  val: parseInt(e.target.value, 10),
                })
              }
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDate">
            <Form.Label className="form-label">Date <span style={{ color: "#D0324B" }}>*</span></Form.Label>

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
            <Form.Label className="form-label">Heure <span style={{ color: "#D0324B" }}>*</span></Form.Label>

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
            <Form.Label className="form-label">
              Description <span style={{ color: "#D0324B" }}>*</span>
            </Form.Label>

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
          {props.errorMessage && <p className="error">{props.errorMessage}</p>}
          <Form.Group as={Row}>
            <Col>
              <Button
                type="submit"
                className="col-12 py-3 fs-2 fw-bold btn-fretto"
              >
                {props.isLoading && (
                  <Spinner animation="border" variant="light" />
                )}
                <span className="mx-2"> Obtenir mes devis </span>
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card>
    );
  }
};

export default JourneyForm;
