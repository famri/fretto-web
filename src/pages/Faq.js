import { Accordion, Col, Container, Row } from "react-bootstrap";
import classes from "./Faq.module.css";

const Faq = () => {
  return (
    <Container>
      <Row xs={1} md={1} className="mt-5 mb-5">
        <Col>
          <h1 className={classes.faqWelcome + " d-flex justify-content-center"}>
            Bienvenue sur le centre d'aide Fretto
          </h1>
        </Col>
      </Row>
      <Row xs={1} md={2} className="g-6">
        <Col>
          <Accordion className="mb-5">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h2>Pourquoi je n'ai pas reçu mes devis par email ?</h2>
              </Accordion.Header>
              <Accordion.Body className={classes.faqResponse}>
                <p>
                  Si vous n'avez pas reçu vos devis au bout de 30 minutes,
                  vérifiez la boite de courriers indésirables. Il se peut que
                  votre fournisseur de messagerie électronique a classé notre
                  message dans une catégorie autre que la boite de réception
                  principale.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion className="mb-5">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h2>
                  Puisse-je annuler une demande après avoir accepté un devis ?
                </h2>
              </Accordion.Header>
              <Accordion.Body className={classes.faqResponse}>
                <p>
                  Chez Fretto, nous comprenons parfaitement le fait que des
                  imprévus peuvent arriver. Vous pouvez annuler votre
                  réservation de transporteur à tout moment. Par respect à nos
                  collaborateurs, nous vous prions de ne pas annuler à la
                  dernière minute. Notre collaborateur, aura ainsi une meilleure
                  chance de trouver une autre course.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col>
          <Accordion className="mb-5">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h2>
                  Pourquoi je dois vérifier mon email et mon numéro de téléphone
                  ?
                </h2>
              </Accordion.Header>
              <Accordion.Body className={classes.faqResponse}>
                <p>
                  Un email et numéro de téléphone valides permettrons à nos
                  collaborateurs de vous joindre afin de répondre au mieux à
                  votre demande de trajet. Nos chauffeurs aurons également
                  besoin de vos coordonnées pour vous contacter le jour du
                  départ. En aucun cas, vos coordonnées ne seront communiqués à
                  une partie tierce.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion className="mb-5">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h2>
                  Pourquoi il est important de complèter et faire valider mon
                  profil ?
                </h2>
              </Accordion.Header>
              <Accordion.Body className={classes.faqResponse}>
                <p>
                  Nos chauffeurs préfèrent communiquer avec des clients ayant un
                  profil validé. Le profil validé est gage d'un client sérieux
                  et nous permet d'éviter les faux comptes et les demandes
                  frauduleuses.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default Faq;
