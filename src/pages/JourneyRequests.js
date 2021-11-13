import { useContext, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import JourneyRequestsLayout from "../components/layout/JourneyRequestsLayout";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import Icon from "../components/widgets/Icon";
import useHttp from "../hooks/use-http";
import { loadJourneyRequests } from "../lib/journey-requests-api";
import AuthContext from "../store/auth-context";
import classes from "./JourneyRequests.module.css";

const JourneyRequests = (props) => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);

  const [sortCriterion, setSortCriterion] = useState("date-time,desc");
  const [periodCriterion, setPeriodCriterion] = useState("m1");
  const [periodTitle, setPeriodTitle] = useState("Dernier mois");
  const [sortTitle, setSortTitle] = useState("Plus récent en premier");

  const [periodItems] = useState([
    { key: "w1", name: "Dernière semaine" },
    { key: "m1", name: "Dernier mois" },
    { key: "m3", name: "Dernier trimestre" },
    { key: "m6", name: "Dernier semestre" },
    { key: "y1", name: "Dernière année" },
  ]);

  const [sortItems] = useState([
    { key: "date-time,desc", name: "Plus récent en premier" },
    { key: "date-time,asc", name: "Plus ancien en premierr" },
  ]);

  const {
    sendRequest: sendLoadJourneyRequests,
    data,
    error,
    status,
  } = useHttp(loadJourneyRequests, true);

  const [showDetailsArray, setShowDetailsArray] = useState([]);

  const onPeriodChosen = (eventKey) => {
    setPeriodTitle(periodItems.find((item) => item.key === eventKey).name);
    setPeriodCriterion(eventKey);
    sendLoadJourneyRequests({
      period: periodCriterion,
      page: "0",
      size: "25",
      sort: sortCriterion,
      lang: "fr_FR",
      token: authCtx.token,
    });
  };

  const onSortChosen = (eventKey) => {
    setSortTitle(sortItems.find((item) => item.key === eventKey).name);
    setSortCriterion(eventKey);
    sendLoadJourneyRequests({
      period: periodCriterion,
      page: "0",
      size: "25",
      sort: sortCriterion,
      lang: "fr_FR",
      token: authCtx.token,
    });
  };

  useEffect(() => {
    sendLoadJourneyRequests({
      period: periodCriterion,
      page: "0",
      size: "25",
      sort: sortCriterion,
      lang: "fr_FR",
      token: authCtx.token,
    });
  }, [sendLoadJourneyRequests, authCtx.token, periodCriterion, sortCriterion]);

  useEffect(() => {
    if (data) {
      setShowDetailsArray(data.map((jr) => false));
    }
  }, [status, data, error, setShowDetailsArray]);

  if (status === "pending") {
    return (
      <Container className="d-flex justify-content-center my-auto">
        <LoadingSpinner></LoadingSpinner>
      </Container>
    );
  }
  if (!!error) {
    return (
      <Container>
        <h1 className="d-flex justify-content-center my-auto error">{error}</h1>
      </Container>
    );
  }
  if (!!data && data.length === 0) {
    return (
      <Container>
        <JourneyRequestsLayout
          periodTitle={periodTitle}
          periodItems={periodItems}
          sortTitle={sortTitle}
          sortItems={sortItems}
          onPeriodChosen={onPeriodChosen}
          onSortChosen={onSortChosen}
        >
          <h1 className="d-flex justify-content-center my-auto">
            Vous n'avez pas de demande de trajet pour cette période.
          </h1>
        </JourneyRequestsLayout>
      </Container>
    );
  }
  if (status === "completed") {
    return (
      <Container>
        {!!data && data.length > 0 && (
          <JourneyRequestsLayout
            periodTitle={periodTitle}
            periodItems={periodItems}
            sortTitle={sortTitle}
            sortItems={sortItems}
            onPeriodChosen={onPeriodChosen}
            onSortChosen={onSortChosen}
          >
            <Row
              xs={1}
              md={3}
              className={!!data && data.length > 0 && "g-" + data.length}
            >
              {data.map((jr, index) => (
                <Col key={jr.id}>
                  <Card className={classes.journeyCard + " my-3 mx-0 "}>
                    <Card.Header
                      className={
                        (new Date(jr.dateTime).getTime() < Date.now()
                          ? classes.expiredHeader
                          : classes.openHeader) +
                        " d-flex justify-content-center fs-3 fw-bold"
                      }
                    >
                      {new Date(jr.dateTime).getTime() < Date.now()
                        ? "Expirée"
                        : "Ouverte"}
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
                          <span className={classes.journeyArrow}> &gt; </span>
                          <span className={classes.arrivalPlace}>
                            {jr.arrivalPlace.name}
                          </span>
                        </span>
                      </Card.Text>
                    </Card.Body>{" "}
                    {showDetailsArray[index] && (
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
                          <div className="d-flex justify-content-center">
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

                        <ListGroup.Item
                          key={jr.id + "-description"}
                          className={
                            classes.journeyDescription +
                            " d-flex justify-content-center fs-2"
                          }
                        >
                          <p>{jr.description}</p>
                        </ListGroup.Item>
                      </ListGroup>
                    )}
                    <Card.Footer className="d-flex justify-content-around">
                      <Button
                        className={classes.journeyButton + " fw-bold fs-4"}
                        variant="primary"
                        onClick={() => {
                          showDetailsArray[index] = !showDetailsArray[index];
                          setShowDetailsArray([...showDetailsArray]);
                        }}
                      >
                        Détails
                      </Button>

                      <Button
                        className={classes.journeyButton + " fw-bold fs-4"}
                        variant="primary"
                        onClick={() => {
                          history.push(
                            "/journey-requests/" + jr.id + "/proposals"
                          );
                        }}
                      >
                        <div>
                          <span>Offres</span>
                          <Badge className="rounded-pill mx-2" bg="danger">
                            {jr.proposalsCount}
                          </Badge>
                        </div>
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </JourneyRequestsLayout>
        )}
        {data.length === 0 && <h1>Vous n'avez pas de demande de trajet</h1>}
      </Container>
    );
  }
};

export default JourneyRequests;
