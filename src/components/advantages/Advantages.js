import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import moneyIcon from "../../assets/icons/money.png";
import qualityIcon from "../../assets/icons/quality.png";
import timeIcon from "../../assets/icons/time.png";
import "./Advantages.css";
const Advantages = () => {
  return (
    <Container className="advantages-container">
      <Row>
        <Col md={4}>
          <div className="advantage">
            <img src={moneyIcon} className="advantages-img" alt="money" />
            <p className="advantages-text fst-italic">
              Jusqu'à 30% d'économies
            </p>
          </div>
        </Col>
        <Col md={4}>
          <div className="advantage">
            <img src={timeIcon} className="advantages-img" alt="time" />
            <p className="advantages-text fst-italic">
              Devis gratuit en 30 minutes
            </p>
          </div>
        </Col>
        <Col md={4}>
          <div className="advantage">
            <img src={qualityIcon} className="advantages-img" alt="quality" />
            <p className="advantages-text fst-italic">
              Les meilleurs professionnels à votre service
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Advantages;
