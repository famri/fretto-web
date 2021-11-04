import { useContext, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import FrettoLogo from "../components/logos/FrettoLogo";
import SignInForm from "../components/signin-form/SignInForm";
import useHttp from "../hooks/use-http";
import { signin } from "../lib/authentication-api";
import AuthContext from "../store/auth-context";
import "./SignIn.css";
const SignIn2 = () => {
  const history = useHistory();

  const authCtx = useContext(AuthContext);

  const {
    sendRequest: sendSigninRequest,
    status: signinStatus,
    data: signinData,
    error: signinError,
  } = useHttp(signin);

  useEffect(() => {
    if (signinStatus === "completed") {
      if (signinError === null) {
        authCtx.login(
          signinData.token,
          signinData.expiresInSec,
          signinData.sub,
          signinData.oauthId,
          signinData.isClient
        );

        history.push(signinData.isClient ? "/journey-requests" : "/journeys");
      }
    }
  }, [signinStatus, signinError, history, authCtx, signinData]);

  return (
    <Fragment>
      <FrettoLogo width="170px"></FrettoLogo>
      <h2 className="text-center py-2 fs-1">Heureux de vous revoir !</h2>
      <div className="text-center my-3">
        <span className="fs-5">Pas encore inscrit sur Fretto ? </span>
        <Link to="/signup" className="link-dark">
          Inscription
        </Link>
      </div>
      <div className="mx-auto">
        <SignInForm
          onSignin={sendSigninRequest}
          errorMessage={signinError}
          isLoading={signinStatus === "pending"}
        ></SignInForm>
      </div>
    </Fragment>
  );
};

export default SignIn2;
