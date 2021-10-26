import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import JourneyRequests from "./pages/JourneyRequests";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AuthContext from "./store/auth-context";
import { useContext } from "react";
function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Switch>
      <Route exact={true} path="/">
        <Home></Home>
      </Route>
      {!authCtx.isLoggedIn && (
        <Route path="/signup">
          <SignUp />
        </Route>
      )}
      {!authCtx.isLoggedIn && (
        <Route path="/signin">
          <SignIn />
        </Route>
      )}
      {authCtx.isLoggedIn && (
        <Route path="/journey-requests">
          <JourneyRequests />
        </Route>
      )}
      <Route path="*">
        <NotFound></NotFound>
      </Route>
    </Switch>
  );
}

export default App;
