import logo from "../../assets/logos/fretto_logo.png";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import classes from "./Footer.module.css";
import playstore from "../../assets/images/fr_android.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Footer = () => {
  return (
    <footer className={classes.footer + " border-top"}>
      <Row className="d-flex justify-content-center">
        <Col md={2}>
          <Link to="/">
            <img className={classes.footerLogo} src={logo} alt="Fretto logo" />
          </Link>
          <a href="https://play.google.com/store/apps/details?id=fr.excentria-it.fretto&gl=FR">
            <img
              src={playstore}
              className={classes.footerLogo}
              alt="play_store_logo"
            ></img>
          </a>
        </Col>
        <Col md={2}>
          <span className={classes.textPrimaryLight + " " + classes.textCap}>
            Support
          </span>

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
              <Link to="/contact" className="link-dark fs-2">
                Nous Contacter
              </Link>
            </li>
          </ul>
        </Col>

        <Col md={2}>
          <span className={classes.textPrimaryLight + " " + classes.textCap}>
            Société
          </span>

          <ul className="list-unstyled ">
            <li>
              <Link to="/values" className="link-dark fs-2">
                Nos Valeurs
              </Link>
            </li>
            <li>
              <Link to="/client-reviews" className="link-dark fs-2">
                Avis Clients
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="link-dark fs-2">
                Offres d'emploi
              </Link>
              <span className="badge bg-warning text-dark rounded-pill ms-2 fs-4">
                3
              </span>
            </li>
          </ul>
        </Col>
        <Col md={2}>
          <span className={classes.textPrimaryLight + " " + classes.textCap}>
            Platforme
          </span>

          <ul className="list-unstyled ">
            <li>
              <Link to="/" className="link-dark fs-2 ">
                Web
              </Link>
            </li>
            <li>
              <a href="https://play.google.com/store/apps/details?id=fr.excentria-it.fretto&gl=FR" className="link-dark fs-2">
                Android
              </a>
            </li>
          </ul>
        </Col>
        <Col md={2}>
          <span className={classes.textPrimaryLight + " " + classes.textCap}>
            Légal
          </span>

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
      <Row className="d-flex border-top justify-content-center  ">
        <Col md={6} className="fs-2 my-auto">
          <p>© Fretto 2021. Tous droits réservés.</p>
        </Col>
        <Col md={2} className="my-auto">
          <ul className="list-inline ">
            <li className="list-inline-item">
              <a href="https://facebook.com/" className=" btn rounded-circle">
                <FontAwesomeIcon
                  icon={faFacebook}
                  className={classes.facebookIcon}
                  size="4x"
                />
              </a>
            </li>
            <li className="list-inline-item">
              <a href="https://twitter.com/" className="btn rounded-circle">
                <FontAwesomeIcon
                  icon={faTwitter}
                  className={classes.twitterIcon}
                  size="4x"
                />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
