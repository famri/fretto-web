import "./Home.css";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import JourneyForm from "../components/journey-form/JourneyForm";
import Usp from "../components/usp/Usp";
import Advantages from "../components/advantages/Advantages";
import frettoTransporter from "../assets/images/fretto_transporter.png";
const Home = () => {
  return (
    <Container fluid className="home-container">
      <Header></Header>

      <Row className="justify-content-md-center px-1">
        <Col md={6} className="py-3">
          <h2 className="text-center home-message">
            Votre comparatif de devis de transporteur
          </h2>

          <Usp></Usp>
          <img
            src={frettoTransporter}
            className="transporter-img"
            alt="fretto_transporter"
          ></img>
        </Col>
        <Col md={3} className="py-3">
          <JourneyForm></JourneyForm>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col>
          <Advantages></Advantages>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col>
          <Footer></Footer>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
