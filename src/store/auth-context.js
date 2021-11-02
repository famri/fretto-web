import React, { useState } from "react";

const FRETTO_AUTH = "frettoAuth";
const AuthContext = React.createContext({
  isLoggedIn: false,
  token: "",
  expiryDate: null,
  sub: "",
  oauthId: "",
  isClient: true,
  login: (token, expiresInMs, sub, oauthId, isClient) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const frettoAuthString = localStorage.getItem(FRETTO_AUTH);

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

  const loginHandler = (token, expiresInMs, sub, oauthId, isClient) => {
    var date = Date.now();
    date += expiresInMs * 1000;
    const expiryDate = new Date(date);

    setAuthState({
      token: token,
      expiryDate: expiryDate,
      sub: sub,
      oauthId: oauthId,
      isClient: isClient,
    });

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
    setTimeout(logoutHandler, expiresInMs);
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
