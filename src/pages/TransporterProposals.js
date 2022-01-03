import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import {
  Accordion, Button, Card,
  Col,
  Container,
  ListGroup, OverlayTrigger, Pagination,
  Row, Tooltip
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import TransporterProposalsLayout from "../components/layout/TransporterProposalsLayout";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import Icon from "../components/widgets/Icon";
import useHttp from "../hooks/use-http";
import { createDiscussion, findDiscussion } from "../lib/discussions-api";
import { loadTransporterProposals } from "../lib/journey-proposals-api";
import AuthContext from "../store/auth-context";
import ToastsContext from "../store/toasts-context";
import TransporterProposalsContext from "../store/transporter-proposals-context";
import classes from "./TransporterProposals.module.css";
const PAGE_SIZE = 25;

const TransporterProposals = (props) => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const transporterProposalsContext = useContext(TransporterProposalsContext);
  const toastsContext = useContext(ToastsContext);
  const calculateHeaderClass = (statusCode) => {
    switch (statusCode) {
      case "ACCEPTED":
        return classes.acceptedHeader;
      case "REJECTED":
        return classes.rejectedHeader;
      case "SUBMITTED":
        return classes.submittedHeader;
      case "CANCELED":
        return classes.canceledHeader;
      default:
        return "";
    }
  };
  const openDiscussion = (interlocutorId) => {
    findDiscussion({
      clientId: authCtx.isClient ? authCtx.oauthId : interlocutorId,
      transporterId: authCtx.isClient ? interlocutorId : authCtx.oauthId,
      token: authCtx.token,
    })
      .then((discussion) => {
        if (discussion !== null) {
          history.push("/discussions/" + discussion.id + "/messages");
        } else {
          createDiscussion({
            clientId: authCtx.isClient ? authCtx.oauthId : interlocutorId,
            transporterId: authCtx.isClient ? interlocutorId : authCtx.oauthId,
            token: authCtx.token,
          })
            .then((discussion) => {
              if (discussion !== null) {
                history.push("/discussions/" + discussion.id + "/messages");
              }
            })
            .catch((error) =>
              toastsContext.pushToast({
                variant: "danger",
                headerText: "Erreur",
                bodyText: error.message,
              })
            );
        }
      })
      .catch((error) => {
        toastsContext.pushToast({
          variant: "danger",
          headerText: "Erreur",
          bodyText: error.message,
        });
      });
  };

  const periodItems = [
    { key: "lm3", name: "Il y a un trimestre" },
    { key: "lm1", name: "Il y a un mois" },
    { key: "w1", name: "Dans une semaine" },
    { key: "m1", name: "Dans un mois" },
  ];

  const sortItems = [
    { key: "price,desc", name: "Prix le plus cher en premier" },
    { key: "price,asc", name: "Prix le moins cher en premierr" },
  ];

  const statusItems = [
    { key: "ALL", name: "Tous les statuts" },
    { key: "SUBMITTED", name: "Envoyé" },
    { key: "ACCEPTED", name: "Accepté" },
    { key: "REJECTED", name: "Rejeté" },
    { key: "CANCELED", name: "Annulé" },
  ];

  const [periodTitle, setPeriodTitle] = useState(
    periodItems.find(
      (item) => item.key === transporterProposalsContext.periodCriterion
    ).name
  );
  const [sortTitle, setSortTitle] = useState(
    sortItems.find(
      (item) => item.key === transporterProposalsContext.sortCriterion
    ).name
  );

  const [statusTitle, setStatusTitle] = useState(
    statusItems.find(
      (item) => item.key === transporterProposalsContext.statusKey
    ).name
  );

  const [totalPages, setTotalPages] = useState();

  const {
    sendRequest: sendLoadTransporterProposals,
    data,
    error,
    status,
  } = useHttp(loadTransporterProposals, true);

  const onPeriodChosen = (eventKey) => {
    setPeriodTitle(periodItems.find((item) => item.key === eventKey).name);
    transporterProposalsContext.setPeriodCriterion(eventKey);
  };

  const onSortChosen = (eventKey) => {
    setSortTitle(sortItems.find((item) => item.key === eventKey).name);
    transporterProposalsContext.setSortCriterion(eventKey);
  };

  const onStatusChosen = (eventKey) => {
    setStatusTitle(statusItems.find((item) => item.key === eventKey).name);
    transporterProposalsContext.setStatusKey(eventKey);
  };

  useEffect(() => {
    sendLoadTransporterProposals({
      period: transporterProposalsContext.periodCriterion,
      sort: transporterProposalsContext.sortCriterion,
      page: transporterProposalsContext.pageNumber,
      size: PAGE_SIZE,
      lang: "fr_FR",
      statuses: transporterProposalsContext.calculateStatuses(
        transporterProposalsContext.statusKey
      ),
      token: authCtx.token,
    });
  }, [
    sendLoadTransporterProposals,
    authCtx.token,
    transporterProposalsContext,
  ]);

  useEffect(() => {
    if (data) {
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
        active={number - 1 === transporterProposalsContext.pageNumber}
        onClick={() => transporterProposalsContext.setPageNumber(number - 1)}
        style={{ cursor: "pointer" }}
      >
        {number}
      </Pagination.Item>
    );
  }

  if (data && data.content.length === 0) {
    return (
      <Container>
        <TransporterProposalsLayout
          periodTitle={periodTitle}
          periodItems={periodItems}
          onPeriodChosen={onPeriodChosen}
          sortTitle={sortTitle}
          sortItems={sortItems}
          onSortChosen={onSortChosen}
          statusTitle={statusTitle}
          statusItems={statusItems}
          onStatusChosen={onStatusChosen}
          pagingItems={pagingItems}
        >
          <h1 className="d-flex justify-content-center my-auto">
            Vous n'avez pas proposé d'offres pour cette période.
          </h1>
        </TransporterProposalsLayout>
      </Container>
    );
  }
  if (status === "completed") {
    return (
      <Container>
        <TransporterProposalsLayout
          periodTitle={periodTitle}
          periodItems={periodItems}
          onPeriodChosen={onPeriodChosen}
          sortTitle={sortTitle}
          sortItems={sortItems}
          onSortChosen={onSortChosen}
          statusTitle={statusTitle}
          statusItems={statusItems}
          onStatusChosen={onStatusChosen}
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
              {data.content.map((jp, index) => (
                <Col key={jp.id}>
                  <Card className={classes.journeyCard + " my-3 mx-0 "}>
                    <Card.Header
                      className={
                        calculateHeaderClass(jp.statusCode) +
                        " d-flex justify-content-center fs-3 fw-bold"
                      }
                    >
                      {jp.status}
                    </Card.Header>
                    <Card.Body>
                      <Card.Title></Card.Title>
                      <Card.Text>
                        <Row xs={3} md={3}>
                          <Col
                            xs={3}
                            md={3}
                            key={jp.journey.client.id + "-avatar"}
                          >
                            <Row xs={1} md={1}>
                              <Col className=" d-flex justify-content-center mb-2">
                                <img
                                  alt={"client-" + index + "-image"}
                                  src={jp.journey.client.photoUrl}
                                  className={classes.avatar}
                                ></img>
                              </Col>
                              <Col
                                key={jp.journey.client.id + "-client-info"}
                                className=" d-flex justify-content-center fs-3 fw-bold"
                              >
                                <span className={classes.transporterName}>
                                  {jp.journey.client.firstname}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col
                            className=" d-flex justify-content-center fs-3 fw-bold"
                            xs={9}
                            md={9}
                          >
                            <Row xs={1} md={1}>
                              <Col>
                                {new Intl.DateTimeFormat("fr-FR", {
                                  dateStyle: "full",
                                  timeStyle: "short",
                                }).format(new Date(jp.journey.dateTime))}
                              </Col>
                              <Col>
                                <span className="d-flex justify-content-center fs-5 ">
                                  <span className={classes.departurePlace}>
                                    {jp.journey.departurePlace.name}
                                  </span>
                                  <span className={classes.journeyArrow}>
                                    {" "}
                                    »»»{" "}
                                  </span>
                                  <span className={classes.arrivalPlace}>
                                    {jp.journey.arrivalPlace.name}
                                  </span>
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Card.Text>
                    </Card.Body>

                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                          <h2>Votre offre</h2>
                        </Accordion.Header>
                        <Accordion.Body>
                          <ListGroup className="list-group-flush">
                            <ListGroup.Item
                              className={
                                classes.proposalPrice +
                                " d-flex justify-content-center fs-2"
                              }
                            >
                              {jp.price + " DT"}
                            </ListGroup.Item>
                            <ListGroup.Item
                              className={" d-flex justify-content-center "}
                            >
                              <img
                                width={150}
                                alt="proposal-vehicule"
                                src={jp.vehicule.photoUrl}
                              ></img>
                            </ListGroup.Item>
                            <ListGroup.Item
                              className={
                                classes.proposalVehiculeName +
                                " d-flex justify-content-center fs-2"
                              }
                            >
                              {jp.vehicule.constructorName +
                                " " +
                                jp.vehicule.modelName}
                            </ListGroup.Item>
                            <ListGroup.Item
                              className={
                                classes.proposalVehiculeRegistration +
                                " d-flex justify-content-center fs-2"
                              }
                            >
                              {jp.vehicule.registrationNumber}
                            </ListGroup.Item>
                          </ListGroup>
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1">
                        <Accordion.Header>
                          <h2>Détails du trajet</h2>
                        </Accordion.Header>
                        <Accordion.Body>
                          <ListGroup className="list-group-flush">
                            <ListGroup.Item
                              key={jp.journey.id + "-distance"}
                              className={
                                classes.journeyDistance +
                                " d-flex justify-content-center "
                              }
                            >
                              {
                                (jp.journey.distance / 1000)
                                  .toString()
                                  .split(".")[0]
                              }{" "}
                              Km
                            </ListGroup.Item>
                            <ListGroup.Item key={jp.journey.id + "-vehicule"}>
                              <div className="d-flex justify-content-center">
                                <Icon
                                  name={jp.journey.engineType.code.toLowerCase()}
                                  color="#44B0E5"
                                  size={80}
                                />
                              </div>
                              <div className="d-flex justify-content-center fs-2">
                                {jp.journey.engineType.name}
                              </div>
                            </ListGroup.Item>

                            <ListGroup.Item
                              key={jp.journey.id + "-workers"}
                              className={
                                classes.journeyWorkers +
                                " d-flex justify-content-center fs-2"
                              }
                            >
                              <span className={classes.journeyWorkersNumber}>
                                {jp.journey.workers}
                              </span>
                              <span className="mx-2">
                                {jp.journey.workers > 1
                                  ? "Manutentionnaires"
                                  : "Manutentionnaire"}
                              </span>
                            </ListGroup.Item>

                            <ListGroup.Item
                              key={jp.journey.id + "-description"}
                              className={
                                classes.journeyDescription +
                                " d-flex justify-content-center fs-2"
                              }
                            >
                              <p>{jp.journey.description}</p>
                            </ListGroup.Item>
                          </ListGroup>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                    {jp.statusCode === "ACCEPTED" && (
                      <Card.Footer className="d-flex justify-content-center">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip className="fs-2 ">Contacter</Tooltip>
                          }
                        >
                          <Button
                            variant="light"
                            className={classes.contactButton}
                            onClick={() => openDiscussion(jp.journey.client.id)}
                          >
                            <FontAwesomeIcon
                              icon={faCommentAlt}
                              size="3x"
                            ></FontAwesomeIcon>
                            <span className="fs-2 fw-bold mx-2 ">
                              Contacter
                            </span>
                          </Button>
                        </OverlayTrigger>
                      </Card.Footer>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </TransporterProposalsLayout>
      </Container>
    );
  }
};

export default TransporterProposals;
