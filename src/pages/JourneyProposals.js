import { useContext, useEffect } from "react";
import { Card, Spinner, Row, Col, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useHttp from "../hooks/use-http";
import { loadJourneyProposals } from "../lib/journey-proposals-api";
import AuthContext from "../store/auth-context";
import classes from "./JourneyProposals.module.css";
const JourneyProposals = () => {
  const params = useParams();
  const authCtx = useContext(AuthContext);
  const {
    sendRequest: sendLoadJourneyProposals,
    status,
    data,
    error,
  } = useHttp(loadJourneyProposals, true);

  useEffect(() => {
    sendLoadJourneyProposals({
      journeyId: params.journeyId,
      filter: "status:submitted,accepted,rejected",
      lang: "fr_FR",
      token: authCtx.token,
    });
  }, [params, authCtx, sendLoadJourneyProposals]);

  useEffect(() => {}, [status, error, data]);

  if (status === "pending") {
    return <Spinner animation="grow" variant="info" className="my-auto d-flex justify-content-center"></Spinner>;
  }
  if (status === "completed") {
    if (!!error) {
      return (
        <h1 className="error d-flex justify-content-center my-auto">{error}</h1>
      );
    }
    if (!!data && data.length === 0) {
      return (
        <h1 className="d-flex justify-content-center my-auto">
          Aucun devis n'a été reçu pour cette demande de trajet.
        </h1>
      );
    }
    return (
      <Container>
        <Row
          xs={1}
          md={3}
          className={!!data && data.length > 0 && "g-" + data.length}
        >
          {!!data &&
            data.length > 0 &&
            data.map((proposal, index) => (
              <Col key={proposal.id}>
                <Card className={classes.proposalCard + " my-3 mx-2"}>
                  <Card.Header
                    className={
                      classes.proposalHeader +
                      " d-flex justify-content-between fs-2"
                    }
                  >
                    <div>
                      <img
                        alt={"transporter-" + index + "-image"}
                        src={proposal.transporter.photoUrl}
                        className={classes.avatar}
                      ></img>
                      <span>{proposal.transporter.globalRating}</span>
                    </div>
                    <div>{proposal.price + " DT"}</div>
                  </Card.Header>
                  <Card.Img
                    src={proposal.vehicule.photoUrl}
                    className={classes.proposalImg}
                  ></Card.Img>

                  <Card.Body></Card.Body>
                  <Card.Footer>toto</Card.Footer>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    );
  }
};

export default JourneyProposals;
