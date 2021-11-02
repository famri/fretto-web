import { Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import FrettoLogo from "../components/logos/FrettoLogo";
import SignUpForm from "../components/signup-form/SignUpForm";
import useHttp from "../hooks/use-http";
import { signup } from "../lib/authentication-api";
import AuthContext from "../store/auth-context";
import { useContext, useEffect } from "react";
import { createUserPreference } from "../lib/user-preferences-api";
import "./SignUp.css";
const SignUp = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const {
    sendRequest: sendSignupRequest,
    status: signupStatus,
    error: signupError,
    data: signupData,
  } = useHttp(signup);

  const {
    sendRequest: sendTimezoneUserPreferenceRequest,
    status: timezoneUserPreferenceStatus,

    error: timezoneUserPreferenceError,
  } = useHttp(createUserPreference);

  const {
    sendRequest: sendLocaleUserPreferenceRequest,
    status: localeUserPreferenceStatus,

    error: localeUserPreferenceError,
  } = useHttp(createUserPreference);

  useEffect(() => {
    if (signupStatus === "completed") {
      if (signupError === null) {
        authCtx.login(
          signupData.token,
          signupData.expiresInMs,
          signupData.sub,
          signupData.oauthId,
          signupData.isClient
        );
        sendTimezoneUserPreferenceRequest({
          userPreference: { timezone: "Africa/Tunis" },
          token: signupData.token,
        });
      }
    }
  }, [
    signupStatus,
    signupError,
    authCtx,
    signupData,
    sendTimezoneUserPreferenceRequest,
  ]);

  useEffect(() => {
    if (timezoneUserPreferenceStatus === "completed") {
      if (timezoneUserPreferenceError === null) {
        sendLocaleUserPreferenceRequest({
          userPreference: { locale: "fr_FR" },
          token: signupData.token,
        });
      }
    }
  }, [
    timezoneUserPreferenceStatus,
    timezoneUserPreferenceError,

    signupData,
    sendLocaleUserPreferenceRequest,
  ]);

  useEffect(() => {
    if (localeUserPreferenceStatus === "completed") {
      if (localeUserPreferenceError === null) {
        history.replace(
          signupData.isClient ? "/journey-requests" : "/journeys"
        );
      }
    }
  }, [
    localeUserPreferenceStatus,
    localeUserPreferenceError,
    signupData,
    history,
    sendLocaleUserPreferenceRequest,
  ]);
  
  return (
    <Container fluid className="signup-container">
      <FrettoLogo width="170px"></FrettoLogo>

      <h2 className="text-center py-2 fs-1 my-1">Prêt à nous rejoindre ?</h2>
      <div className="text-center my-3">
        <span className="fs-5">Déjà inscrit sur Fretto ? </span>
        <Link to="/signin" className="link-dark">
          Connexion
        </Link>
      </div>
      <SignUpForm
        isLoading={signupStatus === "pending"}
        errorMessage={signupError}
        onSignUp={sendSignupRequest}
        showTransporterSwitch={true}
      ></SignUpForm>
    </Container>
  );
};

export default SignUp;
