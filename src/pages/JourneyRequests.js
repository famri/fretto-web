import { useContext, useEffect, useState } from "react";
import {
  Badge,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
  Button,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import Icon from "../components/widgets/Icon";
import useHttp from "../hooks/use-http";
import { loadJourneyRequests } from "../lib/journey-requests-api";
import AuthContext from "../store/auth-context";
import classes from "./JourneyRequests.module.css";
const JourneyRequests = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const {
    sendRequest: sendLoadJourneyRequests,
    data,
    error,
    status,
  } = useHttp(loadJourneyRequests, true);

  const [showDetailsArray, setShowDetailsArray] = useState([]);

  useEffect(() => {
    sendLoadJourneyRequests({
      period: "y1",
      page: "0",
      size: "25",
      sort: "date-time,desc",
      lang: "fr_FR",
      token: authCtx.token,
    });
  }, [sendLoadJourneyRequests, authCtx.token]);

  useEffect(() => {
    if (data) {
      setShowDetailsArray(data.map((jr) => false));
    }
  }, [status, data, error, setShowDetailsArray]);

  if (status === "pending") {
    return (
      <Container className="d-flex container justify-content-center my-auto">
        <LoadingSpinner></LoadingSpinner>
      </Container>
    );
  }
  if (!!error) {
    return (
      <h1 className="error d-flex justify-content-center my-auto">{error}</h1>
    );
  }
  if (!!data && data.length === 0) {
    return (
      <h1 className="d-flex justify-content-center my-auto">
        Vous n'avez pas encore créé de demande de trajet.
      </h1>
    );
  }
  if (status === "completed") {
    return (
      <Container>
        {!!data && data.length > 0 && (
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
                        history.push("/proposals/" + jr.id);
                      }}
                    >
                      <div>
                        <span >Devis</span>
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
        )}
        {data.length === 0 && <h1>Vous n'avez pas de demande de trajet</h1>}
      </Container>
    );
  }
};

export default JourneyRequests;
