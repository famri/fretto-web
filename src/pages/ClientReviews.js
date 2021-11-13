import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

import {
    faStar as faStarSolid,
    faStarHalfAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import useHttp from "../hooks/use-http";
import { loadClientReviews } from "../lib/client-reviews-api";
import classes from "./ClientReviews.module.css";

const ClientReviews = () => {
  const {
    sendRequest: sendLoadClientReviewsRequest,
    status,
    data,
    error,
  } = useHttp(loadClientReviews, true);

  useEffect(() => {
    sendLoadClientReviewsRequest({ page: 0, size: 8 });
  }, [sendLoadClientReviewsRequest]);

  useEffect(() => {}, []);

  if (status === "pending") {
    return (
      <Container className="d-flex justify-content-center my-auto">
        <LoadingSpinner></LoadingSpinner>
      </Container>
    );
  }
  if (!!error) {
    return (
      <Container className="my-auto">
        <h1 className="d-flex justify-content-center my-auto error">{error}</h1>
      </Container>
    );
  }
  if (status === "completed") {
    return (
      <Container className="my-auto">
        <Row xs={1} md={1} className="mt-5 mb-5 ">
          <Col>
            <h1
              className={
                classes.clientReviewsTitle + " d-flex justify-content-center"
              }
            >
              Ce que nos clients disent de nous
            </h1>
          </Col>
        </Row>
        {data && data.length > 0 && (
          <Row xs={1} md={2} className="g-8">
            {data.map((cr, index) => (
              <Col key={cr.id + "-review"}>
                <Card className={classes.clientReviewCard + " my-3 mx-2"}>
                  <Card.Header className=" fs-2">
                    <Row xs={3} md={3} className="g-3">
                      <Col md={2} key={cr.id + "-avatar"}>
                        <img
                          alt={"client-" + index + "-image"}
                          src={cr.client.photoUrl}
                          className={classes.avatar}
                        ></img>
                      </Col>
                      <Col md={7} key={cr.id + "-client-info"}>
                        <span className={classes.clientName}>
                          {cr.client.name}
                        </span>
                        <br />
                        {cr.rating &&
                          cr.rating > 0 &&
                          Array.from([1, 2, 3, 4, 5], (x) =>
                            x <= cr.rating ? (
                              <FontAwesomeIcon
                                key={cr.id + "-" + x + "-star"}
                                icon={faStarSolid}
                                className={classes.ratingStar}
                              />
                            ) : x === Math.ceil(cr.rating) ? (
                              <FontAwesomeIcon
                                key={cr.id + "-" + x + "-star"}
                                icon={faStarHalfAlt}
                                className={classes.ratingStar}
                              />
                            ) : (
                              <FontAwesomeIcon
                                key={cr.id + "-" + x + "-star"}
                                icon={faStarRegular}
                                className={classes.ratingStar}
                              />
                            )
                          )}
                      </Col>
                      <Col
                        md={3}
                        className={classes.reviewDate}
                        key={cr.id + "-date"}
                      >
                        {new Intl.DateTimeFormat("fr-FR", {
                          dateStyle: "short",
                        }).format(new Date(cr.date))}
                      </Col>
                    </Row>
                  </Card.Header>

                  <Card.Body>
                    <p className={classes.reviewContent}>{cr.content}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    );
  }
};

export default ClientReviews;
