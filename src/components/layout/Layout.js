import { Fragment } from "react";
import { Container } from "react-bootstrap";
import MainNavigation from "../header/MainNavigation";
import Footer from "../footer/Footer";
import classes from "./Layout.module.css";
const Layout = (props) => {
  return (
    <Fragment>
      <MainNavigation></MainNavigation>

      <Container fluid className={classes.main} >
        {props.children}
      </Container>

      <Footer></Footer>
    </Fragment>
  );
};

export default Layout;
