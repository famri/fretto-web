import {
    faClock,
    faShieldAlt,
    faStar,
    faUserClock
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Container, Row } from "react-bootstrap";
import classes from "./OurValues.module.css";

const OurValues = () => {
  return (
    <Container className="my-auto">
      <Row xs={1} md={1} className="mt-5 mb-5 ">
        <Col>
          <h1
            className={classes.valuesTitle + " d-flex justify-content-center"}
          >
            Nos Valeurs
          </h1>
        </Col>
      </Row>
      <Row xs={1} md={2} className="g-4">
        <Col>
          <Card className={classes.valueCard + " my-3 mx-2"}>
            <Card.Header className=" fs-2">
              <Row xs={2} md={2} className="d-flex justify-content-start">
                <Col xs={2} md={2}>
                  <FontAwesomeIcon
                    size="2x"
                    icon={faShieldAlt}
                    className={classes.valueIcon}
                  />
                </Col>
                <Col>
                  <span className={classes.valueName}>Confiance</span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <p className={classes.valueContent}>
                Chez Fretto, la confiance entre nous et nos clients est au
                coeurs de nos valeurs. C'est pour ça que nous veillons
                rigoureusement à demander les avis de nos clients sur le service
                Fretto et sur nos transporteurs. Les avis sont publiés ensuite
                en toute transparence.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className={classes.valueCard + " my-3 mx-2"}>
            <Card.Header className=" fs-2">
              <Row xs={2} md={2} className="d-flex justify-content-start">
                <Col xs={2} md={2}>
                  <FontAwesomeIcon
                    size="2x"
                    icon={faClock}
                    className={classes.valueIcon}
                  />
                </Col>
                <Col>
                  <span className={classes.valueName}>Rapidité</span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <p className={classes.valueContent}>
                Nous savons parfaitement que votre temps vaut de l'argent. Par
                conséquent, Fretto s'engage à vous fournir plusieurs devis en
                quelques minutes afin de vous épargner le temps de recherche et
                de comparaison des offres de transporteurs.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className={classes.valueCard + " my-3 mx-2"}>
            <Card.Header className=" fs-2">
              <Row xs={2} md={2} className="d-flex justify-content-start">
                <Col xs={2} md={2}>
                  <FontAwesomeIcon
                    size="2x"
                    icon={faStar}
                    className={classes.valueIcon}
                  />
                </Col>
                <Col>
                  <span className={classes.valueName}>Service</span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <p className={classes.valueContent}>
                La satisfaction client est notre objectif principal. Pour ça,
                nous avons mis à votre disposition les meilleures compétences
                dans le domaine de transport terrestre. Notre service client est
                également à votre écoute et s'engage à vous apporter une
                solution en 48 heures maximum.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className={classes.valueCard + " my-3 mx-2"}>
            <Card.Header className=" fs-2">
              <Row xs={2} md={2} className="d-flex justify-content-start">
                <Col xs={2} md={2}>
                  <FontAwesomeIcon
                    size="2x"
                    icon={faUserClock}
                    className={classes.valueIcon}
                  />
                </Col>
                <Col>
                  <span className={classes.valueName}>Ponctualité</span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <p className={classes.valueContent}>
                Une fois vous avez accepté un devis, notre transporteur vous
                contactera via la messagerie afin de planifier précisément votre
                trajet. Notre transporteur veillera à respecter votre créneau
                horaire afin de vous arranger au mieux.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OurValues;
