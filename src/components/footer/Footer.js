import logo from "../../assets/logos/fretto_logo.png";
import Icon from "../widgets/Icon";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import "./Footer.css";
import playstore from "../../assets/images/fr_android.png";
const Footer = () => {
  return (
    <footer className="footer border-top">
      <Row className="justify-content-md-center">
        <Col md={2}>
          <Link to="/">
            <img className="footer-logo" src={logo} alt="Fretto logo" />
          </Link>
          <a href="https://play.google.com/store/apps/details?id=fr.excentria-it.fretto&gl=FR">
            <img src={playstore} className="footer-logo" alt="play_store_logo"></img>
          </a>
        </Col>
        <Col md={2}>
          <span className="text-cap text-primary-light">Support</span>

          <ul className="list-unstyled ">
            <li>
              <Link to="/faq" className="link-dark fs-2">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/support" className="link-dark fs-2">
                Support
              </Link>
            </li>

            <li>
              <Link to="/client-reviews" className="link-dark fs-2">
                Avis Clients
              </Link>
            </li>
          </ul>
        </Col>

        <Col md={2}>
          <span className="text-cap text-primary-light">Société</span>

          <ul className="list-unstyled ">
            <li>
              <Link to="/values" className="link-dark fs-2">
                Nos Valeurs
              </Link>
            </li>
            <li>
              <Link to="/transporter-signup" className="link-dark fs-2">
                Rejoignez Nous
              </Link>
              <span className="badge bg-warning text-dark rounded-pill ms-2 fs-4">
                5
              </span>
            </li>

            <li>
              <Link to="/contacts" className="link-dark fs-2">
                Contacts
              </Link>
            </li>
          </ul>
        </Col>
        <Col md={2}>
          <span className="text-cap text-primary-light">Platforme</span>

          <ul className="list-unstyled ">
            <li>
              <Link to="/web" className="link-dark fs-2 ">
                Web
              </Link>
            </li>
            <li>
              <Link to="/android" className="link-dark fs-2">
                Android
              </Link>
            </li>
          </ul>
        </Col>
        <Col md={2}>
          <span className="text-cap text-primary-light">Légal</span>

          <ul className="list-unstyled ">
            <li>
              <Link to="/tos" className="link-dark fs-2">
                Conditions d'utilisation
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="link-dark fs-2">
                Politique de Confidentialité
              </Link>
            </li>
          </ul>
        </Col>
      </Row>
      <Row className="border-top justify-content-md-center  ">
        <Col md={6} className="fs-2 my-auto">
          <p>© Fretto 2021. Tous droits réservés.</p>
        </Col>
        <Col md={2} className="my-auto">
          <ul className="list-inline ">
            <li className="list-inline-item">
              <a href="https://twitter.com/" className=" btn rounded-circle">
                <Icon name="twitter" color="#1DA1F2" size={50} />
              </a>
            </li>
            <li className="list-inline-item">
              <a href="https://facebook.com/" className="btn rounded-circle">
                <Icon name="facebook" color="#0777E9" size={50} />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
