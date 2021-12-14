import { useContext, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import "react-image-crop/dist/ReactCrop.css";
import { useHistory } from "react-router";
import SuccessModal from "../components/modal/SuccessModal";
import { validateMobileValidationCode } from "../lib/profile-api";
import AuthContext from "../store/auth-context";
import classes from "./MobileCheck.module.css";
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

      <Card className={classes.mobileCheckCard}>
        <Card.Body>
          <Form
            className="my-5 "
            onSubmit={(event) => {
              handleCodeSubmit(event);
            }}
          >
            <Form.Group className="mb-5">
              <Form.Label className={classes.formLabel}>
                Code <span className="mandatoryAsterisk">*</span>
              </Form.Label>
              <Form.Control
                required
                type="text"
                placeholde="Votre code de vérification"
                minLength={4}
                maxLength={4}
                onChange={(event) => onChange(event)}
              ></Form.Control>
            </Form.Group>

            {validationError && (
              <h1 className=" d-flex justify-content-center my-3 error">
                {validationError}
              </h1>
            )}
            <Button
              type="submit"
              className={classes.sendButton + " col-12 btn-fretto"}
            >
              Envoyer
            </Button>
          </Form>
        </Card.Body>
      </Card>
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
