import { useContext, useEffect, useReducer, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Offcanvas,
  Pagination,
  Row,
  Spinner,
} from "react-bootstrap";
import Select from "react-select";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import ProposalForm from "../components/proposal-form/ProposalForm";
import Icon from "../components/widgets/Icon";
import useHttp from "../hooks/use-http";
import { fetchEngineTypes } from "../lib/engine-types-api";
import { searchJourneyRequests } from "../lib/journey-requests-api";
import { fetchDepartments } from "../lib/places-api";
import { loadTransporterVehicules } from "../lib/vehicules-api";
import AuthContext from "../store/auth-context";
import classes from "./JourneySearch.module.css";

const PAGE_SIZE = 25;

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

const departureReducer = (state, action) => {
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
const arrivalReducer = (state, action) => {
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
        isValid: state.val === "" ? true : state.suggestionChoice !== null,
        suggestionChoice:
          state.suggestionChoice !== null ? state.suggestionChoice : { id: -1 },
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

const engineTypeReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT":
      return {
        touched: true,
        val: action.val,
        isValid: !!action.val && !!action.val.value,
      };
    case "INPUT_BLUR":
      return {
        touched: state.touched,
        val: state.val,
        isValid: state.isValid,
      };
    case "INPUT_VALIDATION":
      return {
        touched: true,
        val: state.val,
        isValid: state.isValid,
      };
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
  suggestionChoice: { id: -1 },
};

const vehiculeInitialState = {
  touched: false,
  val: "",
  id: null,
  isValid: false,
};

const startDateReducer = (state, action) => {
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
        isValid: validateStartDate(action.val, action.endDate),
      };
    case "DATE_BLUR":
      return { touched: true, val: state?.val, isValid: state.isValid };
    case "INPUT_VALIDATION":
      return { touched: true, val: state?.val, isValid: state.isValid };
    default:
      throw new Error();
  }
};

const endDateReducer = (state, action) => {
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
        isValid: validateEndDate(action.startDate, action.val),
      };
    case "DATE_BLUR":
      return { touched: true, val: state?.val, isValid: state.isValid };
    case "INPUT_VALIDATION":
      return { touched: true, val: state?.val, isValid: state.isValid };
    default:
      throw new Error();
  }
};

const validateStartDate = (startDate, endDate) => {
  if (endDate === "") {
    return (
      startDate !== "" &&
      new Date(startDate + "T00:00:00.000Z") >=
        new Date(new Date().toISOString().substr(0, 10) + "T00:00:00.000Z")
    );
  } else {
    return (
      startDate !== "" &&
      new Date(startDate + "T00:00:00.000Z") <=
        new Date(endDate + "T23:59:59.999Z")
    );
  }
};

const validateEndDate = (startDate, endDate) => {
  if (startDate === "") {
    return (
      endDate !== "" &&
      new Date(endDate + "T23:59:59.999Z") >=
        new Date(new Date().toISOString().substr(0, 10) + "T00:00:00.000Z")
    );
  } else {
    return (
      endDate !== "" &&
      new Date(startDate + "T00:00:00.000Z") <=
        new Date(endDate + "T23:59:59.999Z")
    );
  }
};

const JourneySearch = (props) => {
  const authCtx = useContext(AuthContext);

  const [journeyRequests, setJourneyRequests] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [startDateState, dispatchStartDate] = useReducer(startDateReducer, {
    touched: false,
    val: "",
    isValid: false,
  });
  const [endDateState, dispatchEndDate] = useReducer(endDateReducer, {
    touched: false,
    val: "",
    isValid: false,
  });
  const [departureState, dispatchDeparture] = useReducer(
    departureReducer,
    departureInitialState
  );
  const [arrivalState, dispatchArrival] = useReducer(
    arrivalReducer,
    arrivalInitialState
  );

  const [engineTypeOptionState, dispatchEngineTypeOption] = useReducer(
    engineTypeReducer,
    {
      touched: false,
      val: "",
      isValid: false,
    }
  );

  const [showSearchForm, setShowSearchForm] = useState(true);

  const formatOptionLabel = ({ value, label, icon }) => (
    <Row xs={2} md={2}>
      <Col xs={4} md={4}>
        {icon}
      </Col>
      <Col xs={8} md={8} className="my-auto">
        {label}
      </Col>
    </Row>
  );

  const {
    sendRequest: sendLoadEngineTypesRequest,
    status: loadEngineTypesStatus,
    error: loadEngineTypesError,
    data: loadedEngineTypes,
  } = useHttp(fetchEngineTypes, true);

  const {
    sendRequest: sendLoadTransporterVehiculesRequest,
    status: loadTransporterVehiculesStatus,
    error: loadTransporterVehiculesError,
    data: transporterVehicules,
  } = useHttp(loadTransporterVehicules, true);

  const {
    sendRequest: sendLoadDepartureSuggestionsRequest,
    status: loadDepartureSuggestionsStatus,
    error: loadDepartureSuggestionsError,
    data: loadedDepartureSuggestions,
  } = useHttp(fetchDepartments);

  const {
    sendRequest: sendLoadArrivalSuggestionsRequest,
    status: loadArrivalSuggestionsStatus,
    error: loadArrivalSuggestionsError,
    data: loadedArrivalSuggestions,
  } = useHttp(fetchDepartments);

  useEffect(() => {
    sendLoadEngineTypesRequest({ language: "fr_FR" });
  }, [sendLoadEngineTypesRequest]);

  useEffect(() => {
    sendLoadTransporterVehiculesRequest({
      sort: "id,asc",
      lang: "fr_FR",
      token: authCtx.token,
    });
  }, [sendLoadTransporterVehiculesRequest, authCtx.token]);

  const handleSearchJourneyRequests = (event) => {
    event.preventDefault();
    dispatchDeparture({ type: "INPUT_VALIDATION" });
    dispatchArrival({ type: "INPUT_VALIDATION" });
    dispatchEngineTypeOption({ type: "INPUT_VALIDATION" });

    dispatchStartDate({ type: "INPUT_VALIDATION" });
    dispatchEndDate({ type: "INPUT_VALIDATION" });

    if (
      departureState.isValid &&
      arrivalState.isValid &&
      engineTypeOptionState.isValid &&
      startDateState.isValid &&
      endDateState.isValid
    ) {
      proceedToSearch(0);
    }
  };

  const proceedToSearch = (page) => {
    let searchStartDate = startDateState.val + "T00:00:00.000";
    let searchEndDate = endDateState.val + "T23:59:59.999";
    setIsLoading(true);
    searchJourneyRequests({
      departurePlaceId: departureState.suggestionChoice.id,
      arrivalPlaceIds: [arrivalState.suggestionChoice.id],
      startDate: searchStartDate,
      endDate: searchEndDate,
      engineTypeIds: [engineTypeOptionState.val.value],
      token: authCtx.token,
      page: page,
      size: PAGE_SIZE,
      sort: "date-time,desc",
      statuses: ["OPENED"],
      lang: "fr_FR",
    })
      .then((data) => {
        setJourneyRequests([...data.content]);
        setTotalPages(data.totalPages);
        setShowSearchForm(false);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
        setShowSearchForm(false);
      });
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
    engineTypeOptionState && engineTypeOptionState.touched
      ? engineTypeOptionState.val && engineTypeOptionState.val !== ""
        ? "is-valid"
        : "is-invalid"
      : "";

  const startDateClassName =
    startDateState && startDateState.touched
      ? startDateState.isValid
        ? "is-valid"
        : "is-invalid"
      : "";

  const endDateClassName =
    endDateState && endDateState.touched
      ? endDateState.isValid
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

  if (
    loadEngineTypesStatus === "pending" ||
    loadTransporterVehiculesStatus === "pending"
  ) {
    return <Spinner variant="warning" animation="grow"></Spinner>;
  }

  if (!!loadEngineTypesError) {
    return (
      <Container className="centered">
        <h1 className="error">{loadEngineTypesError}</h1>
      </Container>
    );
  }

  if (!!loadTransporterVehiculesError) {
    return (
      <Container className="centered">
        <h1 className="error">{loadTransporterVehiculesError}</h1>
      </Container>
    );
  }

  if (!!errorMessage) {
    return (
      <Container className="centered">
        <h1 className="error">{errorMessage}</h1>
      </Container>
    );
  }
  if (loadEngineTypesStatus === "completed") {
    let pagingItems = [];
    for (let number = 1; number <= totalPages; number++) {
      pagingItems.push(
        <Pagination.Item
          key={number}
          active={number - 1 === pageNumber}
          onClick={() => {
            setPageNumber(number - 1);
            proceedToSearch(number - 1);
          }}
          style={{ cursor: "pointer" }}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Container>
        <Row xs={1} md={2} className="mt-5 mb-5 d-flex justify-content-center">
          <Col xs={12} md={10}>
            <h1 className={classes.journeySearchHeader}>
              Cherchez les derniers trajets !
            </h1>
          </Col>
          <Col xs={12} md={2}>
            {!showSearchForm && (
              <Button
                onClick={() => setShowSearchForm(true)}
                className="fs-2 fw-bold"
              >
                Afficher la recherche
              </Button>
            )}
          </Col>
        </Row>
        {isLoading && (
          <div className="centered">
            <LoadingSpinner></LoadingSpinner>
          </div>
        )}
        <Offcanvas
          show={showSearchForm}
          onHide={() => setShowSearchForm(false)}
        >
          <Offcanvas.Header closeButton className={classes.offCanvas}>
            <Offcanvas.Title>
              <h1 className={classes.journeySearchFormHeader}>
                Critères de recherche
              </h1>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className={classes.journeySearchForm}>
            <Form onSubmit={(event) => handleSearchJourneyRequests(event)}>
              <Form.Group
                className="mb-3 autocomplete"
                controlId="formDeparture"
              >
                <Form.Label className="form-label">
                  Ville de départ <span style={{ color: "#D0324B" }}>*</span>
                </Form.Label>

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
                <Form.Label className="form-label">Ville d'arrivée</Form.Label>

                <Form.Control
                  type="text"
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
                <Form.Label className="form-label">
                  Véhicule <span style={{ color: "#D0324B" }}>*</span>
                </Form.Label>

                <div
                  className={
                    classes.vehiculeSelect +
                    " form-control " +
                    engineTypeClassName
                  }
                >
                  <Select
                    placeholder="Choisissez un véhicule"
                    value={engineTypeOptionState.val}
                    formatOptionLabel={formatOptionLabel}
                    options={loadedEngineTypes.map((engineType) => {
                      return {
                        value: engineType.id,
                        label: engineType.name,
                        icon: (
                          <Icon
                            name={engineType.code.toLowerCase()}
                            color="#44B0E5"
                            size={50}
                          />
                        ),
                      };
                    })}
                    onChange={(selectedOption) =>
                      dispatchEngineTypeOption({
                        type: "USER_INPUT",
                        val: selectedOption,
                      })
                    }
                    onBlur={() =>
                      dispatchEngineTypeOption({ type: "INPUT_BLUR" })
                    }
                  ></Select>
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDate">
                <Form.Label className="form-label">
                  Départ entre le<span style={{ color: "#D0324B" }}>*</span>
                </Form.Label>

                <Form.Control
                  required
                  className={startDateClassName}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  max={maxDate().toISOString().split("T")[0]}
                  value={startDateState.val}
                  onClick={(event) =>
                    dispatchStartDate({
                      type: "DATE_OPENED",
                    })
                  }
                  onChange={(e) =>
                    dispatchStartDate({
                      type: "DATE_CHOSEN",
                      val: e.target.value,
                      endDate: endDateState.val,
                    })
                  }
                  onBlur={(e) =>
                    dispatchStartDate({
                      type: "DATE_BLUR",
                      val: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDate">
                <Form.Label className="form-label">
                  et le<span style={{ color: "#D0324B" }}>*</span>
                </Form.Label>

                <Form.Control
                  required
                  className={endDateClassName}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  max={maxDate().toISOString().split("T")[0]}
                  value={endDateState.val}
                  onClick={(event) =>
                    dispatchEndDate({
                      type: "DATE_OPENED",
                    })
                  }
                  onChange={(e) =>
                    dispatchEndDate({
                      type: "DATE_CHOSEN",
                      val: e.target.value,
                      startDate: startDateState.val,
                    })
                  }
                  onBlur={(e) =>
                    dispatchEndDate({
                      type: "DATE_BLUR",
                      val: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group as={Row}>
                <Col>
                  <Button
                    type="submit"
                    className="col-12 py-3 fs-2 fw-bold btn-fretto"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Spinner animation="border" variant="light" />
                    )}
                    <span className="mx-2"> Chercher </span>
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </Offcanvas.Body>
        </Offcanvas>

        {journeyRequests !== undefined ? (
          journeyRequests.length > 0 ? (
            <Card className="my-5">
              <Card.Body>
                <Row xs={1} md={3} className={"g-" + journeyRequests.length}>
                  {journeyRequests.map((jr, index) => (
                    <Col key={jr.id}>
                      <Card className={" my-3 mx-0 "}>
                        <Card.Header>
                          <Row xs={2} md={2}>
                            <Col xs={3} md={3}>
                              <img
                                alt={"client-" + index + "-image"}
                                src={jr.client.photoUrl}
                                className={classes.avatar}
                              ></img>
                            </Col>
                            <Col>
                              <span className={classes.clientName + " fs-2 "}>
                                {jr.client.firstname}
                              </span>
                            </Col>
                          </Row>
                        </Card.Header>
                        <Card.Body>
                          <Card.Title className=" d-flex justify-content-center fs-3 fw-bold">
                            {new Intl.DateTimeFormat("fr-FR", {
                              dateStyle: "full",
                              timeStyle: "short",
                            }).format(new Date(jr.dateTime))}
                          </Card.Title>
                          <Card.Text>
                            <span className="d-flex justify-content-center fs-5 ">
                              <span className={classes.departurePlace}>
                                {jr.departurePlace.name}
                              </span>
                              <span className={classes.journeyArrow}>»»»</span>
                              <span className={classes.arrivalPlace}>
                                {jr.arrivalPlace.name}
                              </span>
                            </span>
                          </Card.Text>
                        </Card.Body>

                        <ListGroup className="list-group-flush">
                          <ListGroup.Item
                            key={jr.id + "-distance"}
                            className={
                              classes.journeyDistance +
                              " d-flex justify-content-center "
                            }
                          >
                            {(jr.distance / 1000).toString().split(".")[0]} Km
                          </ListGroup.Item>
                          <ListGroup.Item key={jr.id + "-vehicule"}>
                            <div className="d-flex justify-content-center">
                              <Icon
                                name={jr.engineType.code.toLowerCase()}
                                color="#44B0E5"
                                size={80}
                              />
                            </div>
                            <div className="d-flex justify-content-center fs-2">
                              {jr.engineType.name}
                            </div>
                          </ListGroup.Item>

                          <ListGroup.Item
                            key={jr.id + "-workers"}
                            className={
                              classes.journeyWorkers +
                              " d-flex justify-content-center fs-2"
                            }
                          >
                            <span className={classes.journeyWorkersNumber}>
                              {jr.workers}
                            </span>
                            <span className="mx-2">
                              {jr.workers > 1
                                ? "Manutentionnaires"
                                : "Manutentionnaire"}
                            </span>
                          </ListGroup.Item>
                        </ListGroup>
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              <h2>Description</h2>
                            </Accordion.Header>
                            <Accordion.Body
                              key={jr.id + "-description"}
                              className="fs-2"
                            >
                              <p>{jr.description}</p>
                            </Accordion.Body>
                          </Accordion.Item>
                          <Accordion.Item eventKey="1">
                            <Accordion.Header>
                              <h2> Proposer un devis</h2>
                            </Accordion.Header>
                            <Accordion.Body>
                              <ProposalForm
                                journeyId={jr.id}
                                onSubmit={() => {}}
                                vehicules={transporterVehicules}
                              ></ProposalForm>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
              <Card.Footer>
                <Pagination size="lg" className="centered">
                  {pagingItems}
                </Pagination>
              </Card.Footer>
            </Card>
          ) : (
            <h1>Aucun trajet ne correspond à vos critères.</h1>
          )
        ) : (
          <h1>Saisissez vos critères de recherche.</h1>
        )}
      </Container>
    );
  }
};

export default JourneySearch;
