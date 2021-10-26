import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logos/fretto_logo.png";
import AuthContext from "../../store/auth-context";
import "./Header.css";
import { useContext } from "react";
const Header = () => {
  const authCtx = useContext(AuthContext);
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
          <Nav>
            <NavLink to="/" activeClassName="active">
              Accueil
            </NavLink>
            {!authCtx.isLoggedIn && (
              <NavLink to="/signin" activeClassName="active">
                Connexion
              </NavLink>
            )}
            {!authCtx.isLoggedIn && (
              <NavLink to="/signup" activeClassName="active">
                Inscription
              </NavLink>
            )}
            {authCtx.isLoggedIn && (
              <NavLink to="/logout" activeClassName="active" className="btn">
                Déconnexion
              </NavLink>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
