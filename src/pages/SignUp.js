import { Fragment, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import FrettoLogo from "../components/logos/FrettoLogo";
import SignUpForm from "../components/signup-form/SignUpForm";
import useHttp from "../hooks/use-http";
import { signup } from "../lib/authentication-api";
import { createUserPreference } from "../lib/user-preferences-api";
import AuthContext from "../store/auth-context";
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
          userPreference: { timezone: "Europe/Paris" },
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
          signupData.isClient ? "/journey-requests" : "/journey-search"
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
    <Fragment>
      <FrettoLogo width="170px"></FrettoLogo>

      <h2 className="text-center py-2 fs-1 my-1 signup-message">Prêt à nous rejoindre ?</h2>
      <div className="text-center my-3">
        <span className="fs-4">Déjà inscrit sur Fretto ? </span>
        <Link to="/signin" className="link-dark fs-4 ">
          Connexion
        </Link>
      </div>
      <div className="mx-auto mb-5">
        <SignUpForm 
          isLoading={signupStatus === "pending"}
          errorMessage={signupError}
          onSignup={sendSignupRequest}
          showTransporterSwitch={true}
        ></SignUpForm>
      </div>
    </Fragment>
  );
};

export default SignUp;
