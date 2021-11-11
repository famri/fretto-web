import { Accordion, Col, Container, Row } from "react-bootstrap";
import classes from "./Support.module.css";

const Support = () => {
  return (
    <Container>
      <Row xs={1} md={1} className="mt-5 mb-5">
        <Col>
          <h1
            className={
              classes.supportWelcome + " d-flex justify-content-center"
            }
          >
            Notre équipe de support est à votre service
          </h1>
        </Col>
      </Row>
      <Row xs={1} md={2} className="g-6">
        <Col>
          <Accordion className="mb-5">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h2>Horaires:</h2>
              </Accordion.Header>
              <Accordion.Body className={classes.supportContent}>
                <h2 className="fw-bold">Du lundi au Vendredi: </h2>
                <h4>De 9H à 17H</h4>
                <h2 className="fw-bold">Le Samedi: </h2>
                <h4>De 9H à 12H</h4>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col>
          <Accordion className="mb-5">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h2>Téléphone:</h2>
              </Accordion.Header>
              <Accordion.Body className={classes.supportContent}>
                <h2 className="fw-bold">(+216) 72 100 100</h2>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col>
          <Accordion className="mb-5">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h2>Email:</h2>
              </Accordion.Header>
              <Accordion.Body className={classes.supportContent}>
                <h2 className="fw-bold">support@fretto.tn</h2>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col>
          <Accordion className="mb-5">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h2>Adresse:</h2>
              </Accordion.Header>
              <Accordion.Body className={classes.supportContent}>
                <h2 className="fw-bold">Fretto</h2>
                <h2 className="fw-bold">Service Client</h2>
                <h2>1 rue de la liberté, 1002 Tunis</h2>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default Support;
