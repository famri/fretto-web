import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ClientReviews from "./pages/ClientReviews";
import ContactUs from "./pages/ContactUs";
import Discussions from "./pages/Discussions";
import Faq from "./pages/Faq";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JourneyProposals from "./pages/JourneyProposals";
import JourneyRequests from "./pages/JourneyRequests";
import Logout from "./pages/Logout";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import OurValues from "./pages/OurValues";
import PasswordReset from "./pages/PasswordReset";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Support from "./pages/Support";
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
          <Route path="/journey-requests/:journeyId/proposals">
            <JourneyProposals />
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
        {authCtx.isLoggedIn && authCtx.isClient && (
          <Route path="/discussions/:discussionId/messages">
            <Messages />
          </Route>
        )}
        {authCtx.isLoggedIn && authCtx.isClient && (
          <Route path="/discussions">
            <Discussions />
          </Route>
        )}
        {!authCtx.isLoggedIn && (
          <Route path="/logout">
            <Logout />
          </Route>
        )}
        {!authCtx.isLoggedIn && (
          <Route path="/password-reset">
            <PasswordReset />
          </Route>
        )}
        {authCtx.isLoggedIn && (
          <Route path="/profile">
            <Profile />
          </Route>
        )}

        <Route path="/faq">
          <Faq />
        </Route>
        <Route path="/support">
          <Support />
        </Route>
        <Route path="/client-reviews">
          <ClientReviews />
        </Route>
        <Route path="/values">
          <OurValues />
        </Route>
        <Route path="/jobs">
          <Jobs />
        </Route>
        <Route path="/contact">
          <ContactUs />
        </Route>
        <Route path="*">
          <NotFound></NotFound>
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
