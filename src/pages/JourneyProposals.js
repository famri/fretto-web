import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faStar as faStarSolid,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import JourneyProposalsLayout from "../components/layout/JourneyProposalsLayout";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import InfoModal from "../components/modal/InfoModal";
import useHttp from "../hooks/use-http";
import {
  loadJourneyProposals,
  updateProposalStatus,
} from "../lib/journey-proposals-api";
import { loadJourneyRequest } from "../lib/journey-requests-api";
import AuthContext from "../store/auth-context";
import classes from "./JourneyProposals.module.css";

const JourneyProposals = () => {
  const params = useParams();
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [journeyRequest, setJourneyRequest] = useState();
  const [journeyProposals, setJourneyProposals] = useState();
  const [error, setError] = useState();
  const [chosenProposalId, setChosenProposalId] = useState();
  const [showAcceptProposalModal, setShowAcceptProposalModal] = useState();

  useEffect(() => {
    loadJourneyRequest({
      journeyRequestId: params.journeyId,
      token: authCtx.token,
    }).then(
      (data) => {
        setJourneyRequest(data);
        loadJourneyProposals({
          journeyId: params.journeyId,
          filter: "status:submitted,accepted,rejected",
          lang: "fr_FR",
          token: authCtx.token,
        }).then(
          (proposals) => {
            setIsLoading(false);
            setJourneyProposals(proposals);
          },
          (error) => {
            setIsLoading(false);
            setError(error);
          }
        );
      },
      (error) => {
        setIsLoading(false);
        setError(error);
      }
    );
  }, [
    params.journeyId,
    authCtx.token,

    setJourneyRequest,

    setIsLoading,
    setJourneyProposals,
    setError,
  ]);

  const {
    sendRequest: sendUpdateProposalStatus,
    status: proposalUpdateStatus,
    error: proposalUpdateError,
  } = useHttp(updateProposalStatus);

  const showAcceptProposalDialog = (proposalId) => {
    setChosenProposalId(proposalId);
    setShowAcceptProposalModal(true);
  };

  const acceptProposal = () => {
    sendUpdateProposalStatus({
      journeyId: params.journeyId,
      proposalId: chosenProposalId,
      status: "accepted",
      token: authCtx.token,
    });
  };

  useEffect(() => {
    if (proposalUpdateStatus === "completed") {
      setShowAcceptProposalModal(false);

      if (!proposalUpdateError) {
        setIsLoading(true);
        loadJourneyProposals({
          journeyId: params.journeyId,
          filter: "status:submitted,accepted,rejected",
          lang: "fr_FR",
          token: authCtx.token,
        }).then(
          (proposals) => {
            setIsLoading(false);
            setJourneyProposals(proposals);
          },
          (error) => {
            setIsLoading(false);
            setError(error);
          }
        );
      }
    }
  }, [
    proposalUpdateStatus,
    proposalUpdateError,
    params.journeyId,
    authCtx.token,
    setShowAcceptProposalModal,
    setIsLoading,
    setJourneyProposals,
    setError,
  ]);

  if (isLoading) {
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

  if (proposalUpdateStatus === "completed" && !!proposalUpdateError) {
    return (
      <h1 className="error d-flex justify-content-center my-auto">
        {proposalUpdateError}
      </h1>
    );
  }

  if (!!journeyRequest && !!journeyProposals && journeyProposals.length === 0) {
    return (
      <JourneyProposalsLayout journeyRequest={journeyRequest}>
        <h1 className="d-flex justify-content-center my-auto">
          Aucun devis n'a été reçu pour cette demande de trajet.
        </h1>
      </JourneyProposalsLayout>
    );
  }

  return (
    <Container>
      <JourneyProposalsLayout journeyRequest={journeyRequest}>
        <Row
          xs={1}
          md={3}
          className={
            !!journeyProposals &&
            journeyProposals.length > 0 &&
            "g-" + journeyProposals.length
          }
        >
          {!!journeyProposals &&
            journeyProposals.length > 0 &&
            journeyProposals.map((proposal, index) => (
              <Col key={proposal.id}>
                <Card className={classes.proposalCard + " my-3 mx-2"}>
                  <Card.Header className=" fs-2">
                    <Row xs={3} md={3} className="g-3">
                      <Col md={2} key={proposal.id + "-avatar"}>
                        <img
                          alt={"transporter-" + index + "-image"}
                          src={proposal.transporter.photoUrl}
                          className={classes.avatar}
                        ></img>
                      </Col>
                      <Col md={7} key={proposal.id + "-transporter-info"}>
                        <span className={classes.transporterName}>
                          {proposal.transporter.firstname}
                        </span>
                        <br />
                        {proposal.transporter.globalRating &&
                          proposal.transporter.globalRating > 0 &&
                          Array.from([1, 2, 3, 4, 5], (x) =>
                            x <= proposal.transporter.globalRating ? (
                              <FontAwesomeIcon
                                key={proposal.id + "-" + x + "-star"}
                                icon={faStarSolid}
                                className={classes.ratingStar}
                              />
                            ) : x ===
                              Math.ceil(proposal.transporter.globalRating) ? (
                              <FontAwesomeIcon
                                key={proposal.id + "-" + x + "-star"}
                                icon={faStarHalfAlt}
                                className={classes.ratingStar}
                              />
                            ) : (
                              <FontAwesomeIcon
                                key={proposal.id + "-" + x + "-star"}
                                icon={faStarRegular}
                                className={classes.ratingStar}
                              />
                            )
                          )}
                      </Col>
                      <Col
                        md={3}
                        className={classes.proposalPrice}
                        key={proposal.id + "-price"}
                      >
                        {proposal.price + " DT"}
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Img
                    src={proposal.vehicule.photoUrl}
                    className={classes.proposalImg}
                  ></Card.Img>

                  <Card.Body className="fs-2 fw-bold">
                    <ListGroup className="list-group-flush">
                      <ListGroup.Item
                        key={proposal.id + "-vehicule"}
                        className="d-flex justify-content-center"
                      >
                        {proposal.vehicule.constructor +
                          " " +
                          proposal.vehicule.model}
                      </ListGroup.Item>
                      {proposal.status.code !== "SUBMITTED" && (
                        <ListGroup.Item
                          key={proposal.id + "-status"}
                          className={
                            (proposal.status.code === "REJECTED"
                              ? classes.proposalRejected
                              : classes.proposalAccepted) +
                            " d-flex justify-content-center "
                          }
                        >
                          {proposal.status.value}
                        </ListGroup.Item>
                      )}
                      {proposal.status.code === "SUBMITTED" &&
                        new Date(journeyRequest.dateTime).getTime() >
                          Date.now() && (
                          <ListGroup.Item
                            key={proposal.id + "-status"}
                            className="d-flex justify-content-center"
                          >
                            <Button
                              className="fw-bold fs-4"
                              variant="primary"
                              onClick={() =>
                                showAcceptProposalDialog(proposal.id)
                              }
                              disabled={proposalUpdateStatus === "pending"}
                            >
                              ACCEPTER
                            </Button>
                          </ListGroup.Item>
                        )}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </JourneyProposalsLayout>
      <InfoModal
        show={showAcceptProposalModal}
        title="Êtes-vous sûr de vouloir accepter cette offre ?"
        description={
          "Si vous acceptez cette offre, les autres offres seront automatiquement rejetées."
        }
        onActionClick={() => {
          setShowAcceptProposalModal(false);
          acceptProposal();
        }}
        onHide={() => {
          setShowAcceptProposalModal(false);
        }}
        actionName="OUI"
      ></InfoModal>
    </Container>
  );
};

export default JourneyProposals;
