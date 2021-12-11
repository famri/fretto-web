import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import {
  fetchTransporterRatingRequest,
  sendTransporterRating
} from "../lib/rating-api";
import classes from "./TransporterRating.module.css";

const TransporterRating = () => {
  const { search } = useLocation();

  const [ratingRequest, setRatingRequest] = useState();
  const [error, setError] = useState();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(search);
    if (!urlSearchParams.has("uid") || !urlSearchParams.has("h")) {
      setError("Lien erroné!");
      setIsLoading(false);
    } else {
      fetchTransporterRatingRequest({
        uid: urlSearchParams.get("uid"),
        hash: urlSearchParams.get("h"),
      })
        .then((data) => {
          setRatingRequest(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
        });
    }
  }, [search]);

  const handleSendTransporterReview = () => {
    if (rating > 0) {
      sendTransporterRating({
        uid: ratingRequest.client.id,
        hash: ratingRequest.hash,
        comment: comment,
        rating: rating,
      })
        .then((_) => {
          setMessage("Merci d'avoir partagé votre avis !");
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  if (message) {
    return (
      <Container className="d-flex justify-content-center my-auto">
        <span className={classes.ratingHeaderTitle}>{message}</span>
      </Container>
    );
  }
  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center my-auto">
        <LoadingSpinner></LoadingSpinner>
      </Container>
    );
  }
  if (!!error) {
    return <h1 className="centered error"> {error}</h1>;
  }
  return (
    <Container>
      <Card>
        <Card.Header
          className={
            classes.ratingHeaderTitle + " d-flex justify-content-center "
          }
        >
          {"Que pensez vous des services de  " +
            ratingRequest.transporter.firstname}
        </Card.Header>
        <Card.Body>
          <Card.Title className=" d-flex justify-content-center fs-3 fw-bold">
            {new Intl.DateTimeFormat("fr-FR", {
              dateStyle: "full",
              timeStyle: "short",
            }).format(new Date(ratingRequest.journeyRequest.dateTime))}
          </Card.Title>
          <Card.Text>
            <span className="d-flex justify-content-center fs-5 ">
              <span className={classes.departurePlace}>
                {ratingRequest.journeyRequest.departurePlace.name}
              </span>
              <span className={classes.journeyArrow}> &gt; </span>
              <span className={classes.arrivalPlace}>
                {ratingRequest.journeyRequest.arrivalPlace.name}
              </span>
            </span>
          </Card.Text>
          <Row className="my-5">
            <Col className="d-flex justify-content-center">
              <img
                alt={"transporter-avatar"}
                src={ratingRequest.transporter.photoUrl}
                className={classes.avatar}
              ></img>
            </Col>
          </Row>
          <Form.Group xs={1} md={1} className="my-5">
            <Form.Label className="fs-2 fst-italic">
              {"Notez " + ratingRequest.transporter.firstname}
            </Form.Label>
            <div>
              {Array.from([1, 2, 3, 4, 5], (x) =>
                x <= rating ? (
                  <FontAwesomeIcon
                    key={x + "-star"}
                    icon={faStarSolid}
                    size="4x"
                    className={classes.ratingStar}
                    onClick={() => setRating(x)}
                  />
                ) : (
                  <FontAwesomeIcon
                    key={x + "-star"}
                    icon={faStarRegular}
                    size="4x"
                    className={classes.ratingStar}
                    onClick={() => setRating(x)}
                  />
                )
              )}
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label className="fs-2 fst-italic">
              Décrivez sa prestation dans un commentaire:
            </Form.Label>
            <Form.Control
              as={"textarea"}
              rows={3}
              type="text"
              onChange={(event) => setComment(event.target.value)}
            ></Form.Control>
          </Form.Group>
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col className="d-flex justify-content-end">
              <Button
                variant="primary"
                onClick={() => handleSendTransporterReview()}
                className="fs-2 fw-bold"
              >
                Envoyer
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default TransporterRating;
