import { Card, Col, Row } from "react-bootstrap";
import classes from "./JourneyProposalsLayout.module.css";
const JourneyProposalsLayout = (props) => {
  return (
    <Card>
      <Card.Header>
        <Row className="fs-3 fw-bold" xs={1} md={1}>
          <Col className="col-12 d-flex justify-content-center">
            {new Intl.DateTimeFormat("fr-FR", {
              dateStyle: "full",
              timeStyle: "short",
            }).format(new Date(props.journeyRequest.dateTime))}
          </Col>
          <Col className="col-12 d-flex justify-content-center">
            <span className=" fs-5 ">
              <span className={classes.departurePlace}>
                {props.journeyRequest.departurePlace.name}
              </span>
              <span className={classes.journeyArrow}> &gt; </span>
              <span className={classes.arrivalPlace}>
                {props.journeyRequest.arrivalPlace.name}
              </span>
            </span>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>{props.children}</Card.Body>
    </Card>
  );
};

export default JourneyProposalsLayout;
