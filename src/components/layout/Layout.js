import { Fragment } from "react";
import MainNavigation from "../header/MainNavigation";
import Footer from "../footer/Footer";
const Layout = (props) => {
  return (
    <Fragment>
      <MainNavigation></MainNavigation>
      <main>{props.children}</main>
      <Footer></Footer>
    </Fragment>
  );
};

export default Layout;
