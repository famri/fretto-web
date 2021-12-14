import { useReducer, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import classes from "./ProposalForm.module.css";

const priceReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT":
      return {
        touched: true,
        val: action.val,
        isValid: !!action.val && action.val > 0,
      };
    case "INPUT_BLUR":
      return {
        touched: state.touched,
        val: state.val,
        isValid: state.isValid,
      };
    case "INPUT_VALIDATION":
      return {
        touched: true,
        val: state.val,
        isValid: state.isValid,
      };
    default:
      throw new Error();
  }
};

const vehiculeOptionReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT":
      return {
        touched: true,
        val: action.val,
        isValid: !!action.val && !!action.val.value,
      };
    case "INPUT_BLUR":
      return {
        touched: state.touched,
        val: state.val,
        isValid: state.isValid,
      };
    case "INPUT_VALIDATION":
      return {
        touched: true,
        val: state.val,
        isValid: state.isValid,
      };
    default:
      throw new Error();
  }
};

const ProposalForm = (props) => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [priceState, dispatchPrice] = useReducer(priceReducer, {
    touched: false,
    val: "",
    isValid: false,
  });

  const [vehiculeOptionState, dispatchVehiculeOption] = useReducer(
    vehiculeOptionReducer,
    {
      touched: false,
      val: "",
      isValid: false,
    }
  );

  const [error, setError] = useState();

  const options = props.vehicules.map((v) => {
    return {
      value: v.id,
      label: v.regsitrationNumber,
      constructor: v.constructorName,
      model: v.modelName,
      photoUrl: v.photoUrl,
    };
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    dispatchPrice({ type: "INPUT_VALIDATION" });
    dispatchVehiculeOption({ type: "INPUT_VALIDATION" });
    if (priceState.isValid && vehiculeOptionState.isValid) {
      setIsLoading(true);
      try {
        props.onSubmit(
          props.journeyId,
          vehiculeOptionState.val.value,
          priceState.val,
          props.clientFirstname
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatOptionLabel = ({
    value,
    label,
    constructor,
    model,
    photoUrl,
  }) => (
    <Row xs={2} md={2}>
      <Col xs={4} md={4}>
        <img
          src={photoUrl}
          alt={"vehicule-" + value}
          className={classes.vehiculeImage}
        />
      </Col>
      <Col xs={8} md={8}>
        <Row xs={1} md={1}>
          <Col>{label}</Col>
          <Col>{constructor}</Col>
          <Col>{model}</Col>
        </Row>
      </Col>
    </Row>
  );

  const customSelectStyles = {
    control: () => ({
      border: "none",
      display: "flex",
    }),
  };

  const priceClassName = priceState.touched
    ? priceState.isValid
      ? "is-valid"
      : "is-invalid"
    : "";

  const vehiculeClassName = vehiculeOptionState.touched
    ? vehiculeOptionState.isValid
      ? "is-valid"
      : "is-invalid"
    : "";

  if (props.vehicules.length > 0) {
    return (
      <Form onSubmit={(event) => handleSubmit(event)}>
        <Form.Group>
          <Form.Label className="fs-4 fw-bold my-3">
            Proposer un tarif
            <span className={classes.proposalCurrency + " fs-4 fw-bold"}>
              {" "}
              en DT TTC
            </span>
            :
          </Form.Label>
          <Row className="my-3">
            <Col>
              <Form.Control
                className={priceClassName}
                placeholder="Votre tarif"
                type="number"
                onChange={(e) =>
                  dispatchPrice({ type: "USER_INPUT", val: e.target.value })
                }
                onBlur={() => dispatchPrice({ type: "INPUT_BLUR" })}
                value={priceState.val}
              />
            </Col>
          </Row>
        </Form.Group>

        <Row className="my-3" xs={1} md={1}>
          <Col className="fs-4 my-3 fw-bold">
            <span>Choisissez un véhicule: </span>
          </Col>
          <Col>
            <div
              className={
                classes.vehiculeSelect +
                " form-control fs-2 " +
                vehiculeClassName
              }
            >
              <Select
                styles={customSelectStyles}
                placeholder="Choisissez un véhicule"
                value={vehiculeOptionState.val}
                formatOptionLabel={formatOptionLabel}
                options={options}
                onChange={(selectedOption) =>
                  dispatchVehiculeOption({
                    type: "USER_INPUT",
                    val: selectedOption,
                  })
                }
                onBlur={() => dispatchVehiculeOption({ type: "INPUT_BLUR" })}
              ></Select>
            </div>
          </Col>
        </Row>

        {!!error && <h2 className="error my-3"> {error}</h2>}

        <Button
          className="fs-2 fw-bold col-12 my-3"
          type="submit"
          disabled={
            isLoading || !priceState.isValid || !vehiculeOptionState.isValid
          }
        >
          Envoyer
        </Button>
      </Form>
    );
  }

  return (
    <Row xs={1} md={1}>
      <Col className="my-3">
        <h2>Ajouter un véhicule pour pouvoir proposer un devis !</h2>
      </Col>
      <Col>
        <Button
          onClick={() => {
            history.push("/profile");
          }}
          className="fs-2 fw-bold col-12"
        >
          Ajouter
        </Button>
      </Col>
    </Row>
  );
};

export default ProposalForm;
