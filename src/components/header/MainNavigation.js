import { useContext, useState } from "react";
import { Badge, Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logos/fretto_logo.png";
import AuthContext from "../../store/auth-context";
import {
  WebSocketContext,
  WebSocketContextMethods,
} from "../../store/websocket-context";
import classes from "./MainNavigation.css";

const Header = () => {
  const authCtx = useContext(AuthContext);
  const webSocketContextMethods = useContext(WebSocketContextMethods);
  const webSocketContext = useContext(WebSocketContext);
  const handleDisconnect = () => {
    webSocketContextMethods.disconnect();
    authCtx.logout();
  };
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Navbar
      collapseOnSelect
      expand="md"
      bg="light"
      sticky="top"
      className="border-bottom"
      expanded={isExpanded}
      onToggle={(newValue) => setIsExpanded(newValue)}
    >
      <Container>
        <Navbar.Brand>
          <Link to="/">
            <img src={logo} alt="Fretto logo" className="header-logo"></img>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="me-auto"
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            {authCtx.isLoggedIn && authCtx.isClient && (
              <NavLink
                to="/"
                activeClassName="active"
                exact={true}
                className={classes.headerNavLink}
              >
                Accueil
              </NavLink>
            )}

            {authCtx.isLoggedIn && !authCtx.isClient && (
              <NavLink
                to="/journey-search"
                activeClassName="active"
                exact={true}
                className={classes.headerNavLink}
              >
                Recherche
              </NavLink>
            )}

            {!authCtx.isLoggedIn && (
              <NavLink
                to="/signin"
                activeClassName="active"
                className={classes.headerNavLink}
              >
                Connexion
              </NavLink>
            )}
            {!authCtx.isLoggedIn && (
              <NavLink
                to="/signup"
                activeClassName="active"
                className={classes.headerNavLink}
              >
                Inscription
              </NavLink>
            )}
            {authCtx.isLoggedIn && authCtx.isClient && (
              <NavLink
                to="/journey-requests"
                activeClassName="active"
                className={classes.headerNavLink}
              >
                Demandes
              </NavLink>
            )}

            {authCtx.isLoggedIn && (
              <NavLink
                to="/discussions"
                activeClassName="active "
                className={classes.headerNavLink}
              >
                Discussions
                {webSocketContext.missedMessagesCount > 0 && (
                  <Badge className={" rounded-pill mx-2 bg-danger"}>
                    {webSocketContext.missedMessagesCount}
                  </Badge>
                )}
              </NavLink>
            )}
            {authCtx.isLoggedIn && (
              <NavLink
                to="/profile"
                activeClassName="active "
                className={classes.headerNavLink}
              >
                Profil
              </NavLink>
            )}
          </Nav>
          {authCtx.isLoggedIn && (
            <Button
              variant="outline-secondary"
              className={
                classes.headerNavLink + " me-3 fs-2 my-3 mx-3 fst-italic"
              }
              onClick={(event) => handleDisconnect()}
            >
              Déconnexion
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
