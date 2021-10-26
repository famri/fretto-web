import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Container from "react-bootstrap/Container";
import "./Usp.css";

const Usp = () => {
  return (
    <Container className="usp">
      <h3 className="usp-header">100% gratuit et sans engagement!</h3>
      <div>
        <FontAwesomeIcon icon={faCheck} className="check-icon" />

        <span>Recevez jusqu'à 5 devis en quelques minutes</span>
      </div>
      <div>
        <FontAwesomeIcon icon={faCheck} className="check-icon" />

        <span>Choisissez un transporteur de confiance</span>
      </div>
      <div>
        <FontAwesomeIcon icon={faCheck} className="check-icon" />

        <span>Profitez du meilleur tarif</span>
      </div>
    </Container>
  );
};

export default Usp;
