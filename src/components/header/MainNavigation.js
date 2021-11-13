import { useContext } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logos/fretto_logo.png";
import AuthContext from "../../store/auth-context";
import "./MainNavigation.css";

const Header = () => {
  const authCtx = useContext(AuthContext);

  const handleDisconnect = () => {
    authCtx.logout();
  };
  return (
    <Navbar expand="md" bg="light" sticky="top" className="border-bottom">
      <Container>
        <Navbar.Brand>
          <Link to="/">
            <img src={logo} alt="Fretto logo" className="header-logo"></img>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink
              to="/"
              activeClassName="active"
              exact={true}
              className="headerNavLink"
            >
              Accueil
            </NavLink>
            {!authCtx.isLoggedIn && (
              <NavLink
                to="/signin"
                activeClassName="active"
                className="headerNavLink"
              >
                Connexion
              </NavLink>
            )}
            {!authCtx.isLoggedIn && (
              <NavLink
                to="/signup"
                activeClassName="active"
                className="headerNavLink"
              >
                Inscription
              </NavLink>
            )}
            {authCtx.isLoggedIn && authCtx.isClient && (
              <NavLink
                to="/journey-requests"
                activeClassName="active"
                className="headerNavLink"
              >
                Demandes
              </NavLink>
            )}

            {authCtx.isLoggedIn && authCtx.isClient && (
              <NavLink
                to="/discussions"
                activeClassName="active "
                className="headerNavLink"
              >
                Messages
              </NavLink>
            )}
          </Nav>
          {authCtx.isLoggedIn && (
            <Button
              variant="danger"
              className="me-3 fs-2 my-3 mx-3 headerNavLink"
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
