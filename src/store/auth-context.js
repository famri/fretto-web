import { useState, createContext } from "react";
import { useHistory } from "react-router-dom";
const FRETTO_AUTH = "frettoAuth";
const AuthContext = createContext({
  isLoggedIn: false,
  token: "",
  expiryDate: null,
  sub: "",
  oauthId: "",
  isClient: true,
  login: (token, expiresInSec, sub, oauthId, isClient) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const frettoAuthString = localStorage.getItem(FRETTO_AUTH);
  const history = useHistory();
  let fettoAuth = {
    token: "",
    expiryDate: null,
    sub: "",
    oauthId: "",
    isClient: true,
  };

  if (!!frettoAuthString) {
    const isoDatePattern = new RegExp(
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
    );
    fettoAuth = JSON.parse(frettoAuthString, (key, value) => {
      if (typeof value === "string" && value.match(isoDatePattern)) {
        return new Date(value);
      }
      return value;
    });
  }

  const [authState, setAuthState] = useState(fettoAuth);

  const isLoggedIn =
    !!authState.token &&
    !!authState.expiryDate &&
    new Date().getTime() < authState.expiryDate.getTime();

  const loginHandler = (token, expiresInSec, sub, oauthId, isClient) => {
    var date = Date.now();
    date += expiresInSec * 1000;
    const expiryDate = new Date(date);

    localStorage.setItem(
      FRETTO_AUTH,
      JSON.stringify({
        token: token,
        expiryDate: expiryDate,
        sub: sub,
        oauthId: oauthId,
        isClient: isClient,
      })
    );
    
    setAuthState({
      token: token,
      expiryDate: expiryDate,
      sub: sub,
      oauthId: oauthId,
      isClient: isClient,
    });

    setTimeout(() => logoutHandler(), expiresInSec * 1000);
  };

  const logoutHandler = () => {
    setAuthState({
      token: "",
      expiryDate: null,
      sub: "",
      oauthId: "",
      isClient: true,
    });
    localStorage.removeItem(FRETTO_AUTH);
    history.replace("/signin");
  };

  const contextValue = {
    isLoggedIn: isLoggedIn,
    token: authState.token,
    expiryDate: authState.expiryDate,
    sub: authState.sub,
    oauthId: authState.oauthId,
    isClient: authState.isClient,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
