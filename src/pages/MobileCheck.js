import { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "react-image-crop/dist/ReactCrop.css";
import { useHistory } from "react-router";
import { validateMobileValidationCode } from "../lib/profile-api";
import AuthContext from "../store/auth-context";
import classes from "./MobileCheck.module.css";
import SuccessModal from "../components/modal/SuccessModal";
const MobileCheck = () => {
  const authContext = useContext(AuthContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState();
  const [validationError, setValidationError] = useState();
  const history = useHistory();

  const [code, setCode] = useState();

  const handleCodeSubmit = async (event) => {
    event.preventDefault();
    if (code) {
      validateMobileValidationCode({ code: code, token: authContext.token })
        .then((data) => {
          if (data.valid) {
            setShowSuccessModal(true);
          } else {
            setValidationError(
              "Le code est erroné. Veuillez saisir le dernier code reçu par SMS."
            );
          }
        })
        .catch((error) => setError(error));
    }
  };

  const onChange = (event) => {
    if (event.target.value.length >= 4) {
      setCode(event.target.value);
    }
  };

  if (error && error.message) {
    return (
      <h1 className=" d-flex justify-content-center my-auto error">
        {error.message}
      </h1>
    );
  }
  return (
    <Container>
      <h1
        className={
          classes.mobileCheckTitle + " d-flex justify-content-center my-5 "
        }
      >
        Saisissez le code reçu par SMS
      </h1>

      <Form
        className="my-5 "
        onSubmit={(event) => {
          handleCodeSubmit(event);
        }}
      >
        <Row xs={1} md={2}>
          <Col md={10}>
            <Form.Control
              required
              type="text"
              placeholde="Votre code de vérification"
              minLength={4}
              maxLength={4}
              onChange={(event) => onChange(event)}
            ></Form.Control>
          </Col>
          <Col md={2} className={classes.sendButtonCol}>
            <Button
              type="submit"
              className={classes.sendButton + " fs-2 fw-bold"}
            >
              Envoyer
            </Button>
          </Col>
        </Row>
        {validationError && (
          <h1 className=" d-flex justify-content-center my-3 error">
            {validationError}
          </h1>
        )}
      </Form>
      <SuccessModal
        id={"3"}
        show={showSuccessModal}
        title="Numéro mobile validé"
        description="Merci d'avoir fait valider votre numéro de mobile. Vous pouvez désormais profiter pleinement de notre site."
        onActionClick={() => {
          setShowSuccessModal(false);
          history.push("/profile");
        }}
        onHide={() => {
          setShowSuccessModal(false);
          history.push("/profile");
        }}
        actionName="OK"
      ></SuccessModal>
    </Container>
  );
};
export default MobileCheck;
