import { useContext, useState, Fragment } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import frettoTransporter from "../assets/images/fretto_transporter.png";
import Advantages from "../components/advantages/Advantages";
import JourneyForm from "../components/journey-form/JourneyForm";
import SignUpModal from "../components/modal/SignUpModal";
import SuccessModal from "../components/modal/SuccessModal";
import Usp from "../components/usp/Usp";

import { signup } from "../lib/authentication-api";
import { createJourneyRequest } from "../lib/journey-requests-api";
import AuthContext from "../store/auth-context";
import "./Home.css";
import { useHistory } from "react-router-dom";
import { createUserPreference } from "../lib/user-preferences-api";
const Home = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [showSignup, setShowSignup] = useState(false);
  const [journeyRequestError, setJourneyRequestError] = useState();
  const [journeyRequestParams, setJourneyRequestParams] = useState();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [signupError, setSignupError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const onJourneyRequest = (journeyRequestParamsData) => {
    if (authCtx.isLoggedIn) {
      setIsLoading(true);
      createJourneyRequest({
        journeyRequestData: journeyRequestParamsData,
        token: authCtx.token,
      }).then(
        () => {
          setIsLoading(false);
          setShowSuccessModal(true);
        },
        (error) => {
          setIsLoading(false);
          setJourneyRequestError(error.message);
        }
      );
    } else {
      setJourneyRequestParams(journeyRequestParamsData);
      setShowSignup(true);
    }
  };

  const onSignup = (
    isTransporter,
    genderId,
    firstname,
    lastname,
    dateOfBirth,
    email,
    icc,
    mobileNumber,
    userPassword,
    receiveNewsletter
  ) => {
    setIsLoading(true);

    signup(
      isTransporter,
      genderId,
      firstname,
      lastname,
      dateOfBirth,
      email,
      icc,
      mobileNumber,
      userPassword,
      receiveNewsletter
    ).then(
      (signupData) => {
        createUserPreference({
          userPreference: { key: "timezone", value: "Africa/Tunis" },
          token: signupData.token,
        }).then(
          () => {
            createUserPreference({
              userPreference: { key: "locale", value: "fr_FR" },
              token: signupData.token,
            }).then(
              () => {
                createJourneyRequest({
                  journeyRequestData: journeyRequestParams,
                  token: signupData.token,
                }).then(
                  () => {
                    setIsLoading(false);
                    authCtx.login(
                      signupData.token,
                      signupData.expiresInMs,
                      signupData.sub,
                      signupData.oauthId,
                      signupData.isClient
                    );
                    setShowSignup(false);
                    setShowSuccessModal(true);
                  },
                  (error) => {
                    setIsLoading(false);
                    setSignupError(error.message);
                  }
                );
              },
              (error) => {
                setIsLoading(false);
                setSignupError(error.message);
              }
            );
          },
          (error) => {
            setIsLoading(false);
            setSignupError(error.message);
          }
        );
      },
      (error) => {
        setIsLoading(false);

        setSignupError(error.message);
      }
    );
  };

  return (
    <Fragment>
      <Row className="justify-content-md-center px-1">
        <Col md={6} className="py-3">
          <h2 className="text-center home-message ">
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
          <JourneyForm
            isLoading={isLoading}
            onJourneyRequest={onJourneyRequest}
            errorMessage={journeyRequestError}
          ></JourneyForm>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col>
          <Advantages></Advantages>
        </Col>
      </Row>

      <SignUpModal
        show={showSignup}
        handleClose={() => setShowSignup(false)}
        onSignup={onSignup}
        errorMessage={signupError}
        isLoading={isLoading}
      ></SignUpModal>

      <SuccessModal
        show={showSuccessModal}
        title="Votre demande a été enregistrée"
        description="Surveillez votre boite email. Nous vous enverrons vos devis sous peu."
        onActionClick={() => {
          setShowSuccessModal(false);
          history.replace("/journey-requests");
        }}
        onHide={()=>{
          setShowSuccessModal(false);
        }}
        actionName="OK"
      ></SuccessModal>
    </Fragment>
  );
};

export default Home;
