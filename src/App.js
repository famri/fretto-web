import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import JourneyRequests from "./pages/JourneyRequests";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import SignIn2 from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
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
            <SignIn2 />
          </Route>
        )}
        {authCtx.isLoggedIn && (
          <Route path="/journey-requests">
            <JourneyRequests />
          </Route>
        )}

        {!authCtx.isLoggedIn && (
          <Route path="/logout">
            <Logout />
          </Route>
        )}

        <Route path="*">
          <NotFound></NotFound>
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
