import { Fragment, useContext, useEffect, useState } from "react";
import { Container, Toast } from "react-bootstrap";
import ToastsContext from "../../store/toasts-context";
import Footer from "../footer/Footer";
import MainNavigation from "../header/MainNavigation";
import classes from "./Layout.module.css";
const Layout = (props) => {
  const toastsContext = useContext(ToastsContext);
  const [toasts, setToasts] = useState(toastsContext.toasts);

  useEffect(() => {
    setToasts([...toastsContext.toasts]);
  }, [toastsContext.toasts]);

  return (
    <Fragment>
      <MainNavigation></MainNavigation>

      <Container fluid className={classes.main}>
        {props.children}
        <div className="fixed-bottom m-5">
          {toasts.map((t, index) => {
            return (
              <Toast
                style={{ zIndex: 1,}}
                key={index}
                bg={t.variant}
                onClose={() => toastsContext.removeToast(t)}
                show={true}
                delay={4000}
                autohide
               // position="bottom-start"
              >
                <Toast.Header>
                  <strong className="me-auto fs-2 fw-bold">
                    {t.headerText}
                  </strong>
                </Toast.Header>
                <Toast.Body
                  className={
                    t.variant === "dark"
                      ? " text-white fs-2 fw-bold"
                      : "fs-2 fw-bold"
                  }
                >
                  {t.bodyText}
                </Toast.Body>
              </Toast>
            );
          })}
        </div>
      </Container>

      <Footer></Footer>
    </Fragment>
  );
};

export default Layout;
