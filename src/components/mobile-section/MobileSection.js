import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useContext, useReducer, useState } from "react";
import { Button, Card, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import {
  sendMobileValidationCode,
  updateMobileSection,
} from "../../lib/profile-api";
import AuthContext from "../../store/auth-context";
import ErrorModal from "../modal/ErrorModal";
import classes from "./MobileSection.module.css";

const validatePhone = (phoneNumber) => {
  const phonePattern = /^[0-9]{9,10}$/;
  return phonePattern.test(phoneNumber);
};
const iccReducer = (state, action) => {
  switch (action.type) {
    case "MENU_OPENED":
      return {
        touched: true,
        val: state.val,
        isValid: state.isValid,
      };

    case "ICC_CHOSEN":
      return {
        touched: true,
        val: action.val,
        isValid: action.val !== "",
      };

    case "MENU_BLUR":
      return {
        touched: true,
        val: state.val,
        isValid: state.isValid,
      };

    case "INPUT_VALIDATION":
      return { touched: true, val: state.val, isValid: state.isValid };

    default:
      throw new Error();
  }
};
const phoneReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT":
      return {
        touched: true,
        val: action.val,
        isValid: validatePhone(action.val),
      };
    case "INPUT_BLUR":
      return {
        touched: state.touched,
        val: state.val,
        isValid: validatePhone(state.val),
      };
    case "INPUT_VALIDATION":
      return {
        touched: true,
        val: state.val,
        isValid: validatePhone(state.val),
      };
    default:
      throw new Error();
  }
};
const MobileSection = (props) => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const [editMobileSection, setEditMobileSection] = useState(false);

  const [iccState, dispatchIcc] = useReducer(iccReducer, {
    touched: false,
    val: "1",
    isValid: true,
  });
  const [phoneState, dispatchPhone] = useReducer(phoneReducer, {
    touched: false,
    val: props.mobileData.mobileNumber,
    isValid: false,
  });

  const [updateMobileSectionError, setUpdateMobileSectionError] = useState();

  const [showFailureModal, setShowFailureModal] = useState(false);

  const ICC_LIST = [
    { key: "", value: "Indicateur" },
    { key: "1", value: "+33" },
  ];
  const handleSave = () => {
    dispatchIcc({ type: "INPUT_VALIDATION" });
    dispatchPhone({ type: "INPUT_VALIDATION" });

    if (iccState.isValid && phoneState.isValid) {
      if (props.mobileData.mobileNumber === phoneState.val.trim()) {
        setEditMobileSection(false);
      } else {
        updateMobileSection({
          iccId: iccState.val,
          mobileNumber: phoneState.val,
          token: authContext.token,
        })
          .then(() => {
            setEditMobileSection(false);
            props.afterUpdateCallback();
          })
          .catch((updateMobileSectionError) => {
            setUpdateMobileSectionError(updateMobileSectionError);
          });
      }
    }
  };
  const requestSendMobileValidationCode = (event) => {
    event.preventDefault();
    sendMobileValidationCode({
      mobileNumber: phoneState.val,
      icc: ICC_LIST.find((el) => el.key === iccState.val).value,
      token: authContext.token,
    })
      .then(() => {
        history.push("/profile/check-mobile");
      })
      .catch((error) => {
        setShowFailureModal(true);
      });
  };
  const iccClassName =
    iccState && iccState.touched
      ? iccState.val && iccState.isValid
        ? "is-valid"
        : "is-invalid"
      : "";

  const phoneClassName = phoneState.touched
    ? phoneState.isValid
      ? "is-valid"
      : "is-invalid"
    : "";

  return (
    <Fragment>
      <Card>
        <Card.Header className="fs-2 fw-bold">
          <div className="d-flex justify-content-between">
            <h1>Numéro Mobile</h1>
            <Button
              className="fs-2"
              onClick={() => {
                !editMobileSection
                  ? setEditMobileSection(!editMobileSection)
                  : handleSave();
              }}
            >
              {!editMobileSection ? "Editer" : "Sauvegarder"}
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {updateMobileSectionError && !!updateMobileSectionError.message && (
            <h1 className="d-flex justify-content-center error">
              {updateMobileSectionError.message}
            </h1>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fs-2">Téléphone Mobile</Form.Label>
              <div className={classes.rowGroup}>
                <Form.Select
                  disabled={!editMobileSection}
                  className={classes.iccSelect + "  fs-2 " + iccClassName }
                  required
                  onChange={(event) =>
                    dispatchIcc({
                      type: "ICC_CHOSEN",
                      val: event.target.value,
                    })
                  }
                  onClick={(event) =>
                    dispatchIcc({
                      type: "MENU_OPENED",
                    })
                  }
                  onBlur={(event) =>
                    dispatchIcc({
                      type: "MENU_BLUR",
                    })
                  }
                  value={iccState.val}
                >
                  {ICC_LIST.map((iccObj) => (
                    <option key={iccObj.key} value={iccObj.key}>
                      {iccObj.value}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  disabled={!editMobileSection}
                  style={{ display: "inline" }}
                  className={classes.mobileInput + " " + phoneClassName}
                  required
                  type="number"
                  onChange={(e) =>
                    dispatchPhone({
                      type: "USER_INPUT",
                      val: e.target.value,
                    })
                  }
                  onBlur={() => dispatchPhone({ type: "INPUT_BLUR" })}
                  value={phoneState.val}
                ></Form.Control>
              </div>
            </Form.Group>
          </Form>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end">
          <div className="my-3">
            {props.mobileData.checked && (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip className="fs-2 ">Numéro mobile vérifié</Tooltip>
                }
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
            {!props.mobileData.checked && (
              <Link
                onClick={(event) => {
                  requestSendMobileValidationCode(event);
                }}
                className="fs-2  "
              >
                Faire vérifier mon numéro mobile
              </Link>
            )}
          </div>
        </Card.Footer>
      </Card>

      <ErrorModal
        id={"2"}
        show={showFailureModal}
        title="Échec de l'envoi code par SMS"
        description="Une erreur s'est produite lors de la tentative d'envoi du code de validation. Veuillez réessayer ou contacter le support si le problème persiste."
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

export default MobileSection;
