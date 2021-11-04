import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import JourneyRequests from "./pages/JourneyRequests";
import JourneyProposals from "./pages/JourneyProposals";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
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
            <SignIn />
          </Route>
        )}
        {authCtx.isLoggedIn && authCtx.isClient && (
          <Route path="/journey-requests">
            <JourneyRequests />
          </Route>
        )}
        {authCtx.isLoggedIn && !authCtx.isClient && (
          <Route path="/journeys">
            <JourneyRequests />
          </Route>
        )}
        {!authCtx.isLoggedIn && (
          <Route path="/logout">
            <Logout />
          </Route>
        )}
        {authCtx.isLoggedIn && authCtx.isClient && (
          <Route path="/proposals/:journeyId">
            <JourneyProposals />
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
