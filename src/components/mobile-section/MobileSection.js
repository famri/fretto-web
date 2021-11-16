import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useReducer, useState } from "react";
import { Button, Card, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { updateMobileSection } from "../../lib/profile-api";
import AuthContext from "../../store/auth-context";

const validatePhone = (phoneNumber) => {
  const phonePattern = /^[0-9]{8}$/;
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
            <Form.Label>Téléphone Mobile</Form.Label>
            <div className="row-group">
              <Form.Select
                disabled={!editMobileSection}
                style={{ width: "45%" }}
                className={iccClassName}
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
                <option value="">Indicateur</option>
                <option value="1">+216</option>
              </Form.Select>
              <Form.Control
                disabled={!editMobileSection}
                style={{ display: "inline" }}
                className={phoneClassName}
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
              overlay={<Tooltip className="fs-2 ">Numéro mobile vérifié</Tooltip>}
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
          {!props.mobileData.checkedd && (
            <Link to="" className="fs-2  ">
              Faire vérifier mon numéro mobile
            </Link>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default MobileSection;
