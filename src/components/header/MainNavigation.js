import { useContext } from "react";
import { Badge, Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logos/fretto_logo.png";
import AuthContext from "../../store/auth-context";
import {
  WebSocketContext,
  WebSocketContextMethods
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

  return (
    <Navbar
      collapseOnSelect
      expand="md"
      bg="light"
      sticky="top"
      className="border-bottom"
    >
      <Container>
        <Navbar.Brand>
          <Link to="/">
            <img src={logo} alt="Fretto logo" className="header-logo"></img>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {authCtx.isLoggedIn && authCtx.isClient && (
              <Nav.Link
                eventKey="1"
                as={NavLink}
                to="/"
                activeClassName="active"
                exact={true}
                className={classes.headerNavLink}
              >
                Accueil
              </Nav.Link>
            )}

            {authCtx.isLoggedIn && !authCtx.isClient && (
              <Nav.Link
                eventKey="2"
                as={NavLink}
                to="/journey-search"
                activeClassName="active"
                exact={true}
                className={classes.headerNavLink}
              >
                Recherche
              </Nav.Link>
            )}

            {!authCtx.isLoggedIn && (
              <Nav.Link
                eventKey="3"
                as={NavLink}
                to="/signin"
                activeClassName="active"
                className={classes.headerNavLink}
              >
                Connexion
              </Nav.Link>
            )}
            {!authCtx.isLoggedIn && (
              <Nav.Link
                eventKey="4"
                as={NavLink}
                to="/signup"
                activeClassName="active"
                className={classes.headerNavLink}
              >
                Inscription
              </Nav.Link>
            )}
            {authCtx.isLoggedIn && authCtx.isClient && (
              <Nav.Link
                eventKey="5"
                as={NavLink}
                to="/journey-requests"
                activeClassName="active"
                className={classes.headerNavLink}
              >
                Demandes
              </Nav.Link>
            )}

            {authCtx.isLoggedIn && (
              <Nav.Link
                eventKey="6"
                as={NavLink}
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
              </Nav.Link>
            )}
            {authCtx.isLoggedIn && !authCtx.isClient && (
              <Nav.Link
                as={NavLink}
                eventKey="7"
                to="/journeys"
                activeClassName="active "
                className={classes.headerNavLink}
              >
                Mes Trajets
              </Nav.Link>
            )}
            {authCtx.isLoggedIn && (
              <Nav.Link
                as={NavLink}
                eventKey="8"
                to="/profile"
                activeClassName="active "
                className={classes.headerNavLink}
              >
                Profil
              </Nav.Link>
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
