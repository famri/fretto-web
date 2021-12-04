import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useContext, useReducer, useState } from "react";
import { Button, Card, Form, OverlayTrigger, Tooltip } from "react-bootstrap";

import { updateEmailSection } from "../../lib/profile-api";
import AuthContext from "../../store/auth-context";
import ErrorModal from "../modal/ErrorModal";
import SuccessModal from "../modal/SuccessModal";
import { sendEmailValidationLink } from "../../lib/profile-api";


const validateEmail = (email) => {
  const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  return emailPattern.test(email);
};
const emailReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT":
      return {
        touched: true,
        val: action.val,
        isValid: validateEmail(action.val),
      };
    case "INPUT_BLUR":
      return {
        touched: state.touched,
        val: state.val,
        isValid: validateEmail(state.val),
      };
    case "INPUT_VALIDATION":
      return {
        touched: true,
        val: state.val,
        isValid: validateEmail(state.val),
      };
    default:
      throw new Error();
  }
};
const EmailSection = (props) => {
  const authContext = useContext(AuthContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [editEmailSection, setEditEmailSection] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    touched: false,
    val: props.emailData.email,
    isValid: true,
  });

  const [updateEmailSectionError, setUpdateEmailSectionError] = useState();

  const requestSendEmailValidationLink = (event) => {
    event.preventDefault();
    sendEmailValidationLink({
      email: emailState.val,
      locale: "fr_FR",
      token: authContext.token,
    })
      .then(() => {
        setShowSuccessModal(true);
      })
      .catch((error) => {
        setShowFailureModal(true);
      });
  };

  const handleSave = () => {
    dispatchEmail({ type: "INPUT_VALIDATION" });

    if (emailState.isValid) {
      if (props.emailData.email === emailState.val.trim()) {
        setEditEmailSection(false);
      } else {
        updateEmailSection({
          email: emailState.val,
          token: authContext.token,
        })
          .then(() => {
            setEditEmailSection(false);
            props.afterUpdateCallback();
          })
          .catch((updateEmailSectionError) => {
            setUpdateEmailSectionError(updateEmailSectionError);
          });
      }
    }
  };

  const emailClassName =
    emailState && emailState.touched
      ? emailState.val && emailState.isValid
        ? "is-valid"
        : "is-invalid"
      : "";

  return (
    <Fragment>
      <Card>
        <Card.Header className="fs-2 fw-bold">
          <div className="d-flex justify-content-between">
            <h1>Email</h1>
            <Button
              className="fs-2"
              onClick={() => {
                !editEmailSection
                  ? setEditEmailSection(!editEmailSection)
                  : handleSave();
              }}
            >
              {!editEmailSection ? "Editer" : "Sauvegarder"}
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {updateEmailSectionError && !!updateEmailSectionError.message && (
            <h1 className="d-flex justify-content-center error">
              {updateEmailSectionError.message}
            </h1>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fs-2">Email</Form.Label>
              <Form.Control
                disabled={!editEmailSection}
                required={true}
                type="text"
                className={emailClassName}
                value={emailState.val}
                onChange={(e) =>
                  dispatchEmail({
                    type: "USER_INPUT",
                    val: e.target.value,
                  })
                }
                onBlur={(e) =>
                  dispatchEmail({
                    type: "INPUT_BLUR",
                    val: e.target.value,
                  })
                }
              ></Form.Control>
            </Form.Group>
          </Form>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end">
          <div className="my-3">
            {props.emailData.checked && (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip className="fs-2 ">Email vérifié</Tooltip>}
              >
                <Button variant="light">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size="3x"
                    color="#B3CE55"
                  />
                </Button>
              </OverlayTrigger>
            )}
            {!props.emailData.checked && (
              <a
                href="/profile"
                className={ " fs-2"}
                onClick={(event) => {
                  requestSendEmailValidationLink(event);
                }}
              >
                Faire vérifier mon email
              </a>
            )}
          </div>
        </Card.Footer>
      </Card>

      <SuccessModal
        id={"1"}
        show={showSuccessModal}
        title="Lien de validation envoyé"
        description="Veuillez consulter votre boite email. Un lien de validation vous a été envoyé."
        onActionClick={() => {
          setShowSuccessModal(false);
        }}
        onHide={() => {
          setShowSuccessModal(false);
        }}
        actionName="OK"
      ></SuccessModal>

      <ErrorModal
        id={"1"}
        show={showFailureModal}
        title="Échec de l'envoi du lien de validation"
        description="Une erreur s'est produite lors de la tentative d'envoi du lien de validation. Veuillez réessayer ou contacter le support si le problème persiste."
        onActionClick={() => {
          setShowFailureModal(false);
        }}
        onHide={() => {
          setShowFailureModal(false);
        }}
        actionName="OK"
      ></ErrorModal>
    </Fragment>
  );
};

export default EmailSection;
