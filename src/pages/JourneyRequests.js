import { useContext, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Pagination,
  Row
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import JourneyRequestsLayout from "../components/layout/JourneyRequestsLayout";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import Icon from "../components/widgets/Icon";
import useHttp from "../hooks/use-http";
import { loadJourneyRequests } from "../lib/journey-requests-api";
import AuthContext from "../store/auth-context";
import JourneyRequestsContext from "../store/Journey-requests-context";
import classes from "./JourneyRequests.module.css";

const PAGE_SIZE = 25;

const JourneyRequests = (props) => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const journeyRequestsContext = useContext(JourneyRequestsContext);
  const periodItems = [
    { key: "w1", name: "Dernière semaine" },
    { key: "m1", name: "Dernier mois" },
    { key: "m3", name: "Dernier trimestre" },
    { key: "m6", name: "Dernier semestre" },
    { key: "y1", name: "Dernière année" },
  ];

  const sortItems = [
    { key: "date-time,desc", name: "Plus récent en premier" },
    { key: "date-time,asc", name: "Plus ancien en premierr" },
  ];
  const [periodTitle, setPeriodTitle] = useState(
    periodItems.find(
      (item) => item.key === journeyRequestsContext.periodCriterion
    ).name
  );
  const [sortTitle, setSortTitle] = useState(
    sortItems.find((item) => item.key === journeyRequestsContext.sortCriterion)
      .name
  );
  const [totalPages, setTotalPages] = useState();

  const {
    sendRequest: sendLoadJourneyRequests,
    data,
    error,
    status,
  } = useHttp(loadJourneyRequests, true);

  const [showDetailsArray, setShowDetailsArray] = useState([]);

  const onPeriodChosen = (eventKey) => {
    setPeriodTitle(periodItems.find((item) => item.key === eventKey).name);
    journeyRequestsContext.setPeriodCriterion(eventKey);
  };

  const onSortChosen = (eventKey) => {
    setSortTitle(sortItems.find((item) => item.key === eventKey).name);
    journeyRequestsContext.setSortCriterion(eventKey);
  };

  useEffect(() => {
    sendLoadJourneyRequests({
      period: journeyRequestsContext.periodCriterion,
      sort: journeyRequestsContext.sortCriterion,
      page: journeyRequestsContext.pageNumber,
      size: PAGE_SIZE,
      lang: "fr_FR",
      token: authCtx.token,
    });
  }, [
    sendLoadJourneyRequests,
    authCtx.token,
    journeyRequestsContext.periodCriterion,
    journeyRequestsContext.sortCriterion,
    journeyRequestsContext.pageNumber,
  ]);

  useEffect(() => {
    if (data) {
      setShowDetailsArray(data.content.map((jr) => false));
      setTotalPages(data.totalPages);
    }
  }, [data]);

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

  let pagingItems = [];
  for (let number = 1; number <= totalPages; number++) {
    pagingItems.push(
      <Pagination.Item
        key={number}
        active={number - 1 === journeyRequestsContext.pageNumber}
        onClick={() => journeyRequestsContext.setPageNumber(number - 1)}
        style={{ cursor: "pointer" }}
      >
        {number}
      </Pagination.Item>
    );
  }

  if (data && data.content.length === 0) {
    return (
      <Container>
        <JourneyRequestsLayout
          periodTitle={periodTitle}
          periodItems={periodItems}
          sortTitle={sortTitle}
          sortItems={sortItems}
          onPeriodChosen={onPeriodChosen}
          onSortChosen={onSortChosen}
          pagingItems={pagingItems}
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
        <JourneyRequestsLayout
          periodTitle={periodTitle}
          periodItems={periodItems}
          sortTitle={sortTitle}
          sortItems={sortItems}
          onPeriodChosen={onPeriodChosen}
          onSortChosen={onSortChosen}
          pagingItems={pagingItems}
        >
          {data && data.content.length === 0 && (
            <h1 className="centered">
              Vous n'avez pas de demande de trajet pour cette période.
            </h1>
          )}
          {data && data.content.length > 0 && (
            <Row
              xs={1}
              md={3}
              className={
                data && data.content.length > 0 && "g-" + data.content.length
              }
            >
              {data.content.map((jr, index) => (
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
          )}
        </JourneyRequestsLayout>
      </Container>
    );
  }
};

export default JourneyRequests;
