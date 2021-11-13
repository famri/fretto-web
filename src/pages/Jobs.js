import { useEffect } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import useHttp from "../hooks/use-http";
import classes from "./Jobs.module.css";
import { loadJobs } from "../lib/jobs-api";
const Jobs = () => {
  const {
    sendRequest: sendLoadJobsRequest,
    status,
    data,
    error,
  } = useHttp(loadJobs, true);

  useEffect(() => {
    sendLoadJobsRequest({ page: 0, size: 8 });
  }, [sendLoadJobsRequest]);

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
              className={classes.jobHeader + " d-flex justify-content-center"}
            >
              {data && data.length > 0
                ? "Nous recrutons les profils suivants"
                : "Actuellement, nous n'avons pas de poste ouvert."}
            </h1>
          </Col>
        </Row>
        <Row xs={1} md={2} className="g-4">
          {data &&
            data.length > 0 &&
            data.map((jo, index) => (
              <Col>
                <Card className={classes.jobCard + " my-3 mx-2  "}>
                  <Card.Header className=" fs-2 bg-warning">
                    <Row xs={1} md={1} >
                      <Col className="d-flex justify-content-center">
                        <span className={classes.jobTitle}>{jo.title}</span>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup className="list-group-flush">
                      <ListGroup.Item
                        key={jo.id + "-contract"}
                        className={
                          classes.jobContract +
                          " d-flex justify-content-between"
                        }
                      >
                        <span>Type de contrat</span>
                        <span>{jo.contract}</span>
                      </ListGroup.Item>
                      <ListGroup.Item
                        key={jo.id + "-location"}
                        className={
                          classes.jobLocation +
                          " d-flex justify-content-between"
                        }
                      >
                        <span>Localisation</span>
                        <span>{jo.location}</span>
                      </ListGroup.Item>

                      <ListGroup.Item
                        key={jo.id + "-date"}
                        className={
                          classes.jobDate + " d-flex justify-content-between"
                        }
                      >
                        <span>Date de publication</span>
                        <span>{jo.date}</span>
                      </ListGroup.Item>

                      <ListGroup.Item
                        key={jo.id + "-description"}
                        className={classes.jobDescription + " "}
                      >
                        <p>{jo.description}</p>
                      </ListGroup.Item>
                      <ListGroup.Item
                        key={jo.id + "-profile"}
                        className={classes.jobProfile + " "}
                      >
                        <ul>
                          {jo.profile.map((jp, index) => (
                            <li key={"profile-" + index}>{jp}</li>
                          ))}
                        </ul>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    );
  }
};

export default Jobs;
