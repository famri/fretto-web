import React, { useState } from "react";

const FRETTO_AUTH = "frettoAuth";
const AuthContext = React.createContext({
  isLoggedIn: false,
  token: "",
  expiryDate: null,
  login: (token, expiryDate) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const frettoAuthString = localStorage.getItem(FRETTO_AUTH);

  let fettoAuth = { token: "", expiryDate: null };

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
    new Date().isBefore(authState.expiryDate);

  const loginHandler = (token, expiresInMs) => {
    var currentDate = new Date();
    currentDate.setMilliseconds(currentDate.getMilliseconds + expiresInMs);
    var expiryDate = currentDate;

    setAuthState({ token: token, expiryDate: expiryDate });
    localStorage.setItem(
      FRETTO_AUTH,
      JSON.stringify({ token: token, expiryDate: expiryDate })
    );
    setTimeout(logoutHandler, expiresInMs);
  };

  const logoutHandler = () => {
    setAuthState({ token: "", expiryDate: null });
    localStorage.removeItem(FRETTO_AUTH);
  };

  const contextValue = {
    isLoggedIn: isLoggedIn,
    token: authState.token,
    expiryDate: authState.expiryDate,
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
