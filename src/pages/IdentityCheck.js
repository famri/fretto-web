import { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "react-image-crop/dist/ReactCrop.css";
import { useHistory } from "react-router";
import { uploadIdentityFile } from "../lib/profile-api";
import AuthContext from "../store/auth-context";
import classes from "./IdentityCheck.module.css";

const IdentityCheck = () => {
  const authContext = useContext(AuthContext);

  const [error, setError] = useState();
  const history = useHistory();

  const [documentFile, setDocumentFile] = useState();

  const handleDocumentSubmit = async (event) => {
    event.preventDefault();
    if (documentFile) {
      uploadIdentityFile({ document: documentFile, token: authContext.token })
        .then(() => history.push("/profile"))
        .catch((error) => setError(error));
    }
  };

  const onDocumentChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setDocumentFile(event.target.files[0]);
    }
  };

  if (error && error.message) {
    return (
      <h1 className=" d-flex justify-content-center my-auto error">
        {error.message}
      </h1>
    );
  }
  return (
    <Container>
      <h1
        className={
          classes.editProfileImageTitle + " d-flex justify-content-center my-5 "
        }
      >
        Enoyez nous votre pièce d'identité (pdf ou jpeg)
      </h1>

      <Form
        className="my-5 "
        onSubmit={(event) => {
          handleDocumentSubmit(event);
        }}
      >
        <Row xs={1} md={2}>
          <Col md={10}>
            <Form.Control
              required
              type="file"
              accept="application/pdf, image/jpeg"
              onChange={(event) => onDocumentChange(event)}
            ></Form.Control>
          </Col>
          <Col md={2} className={classes.sendButtonCol}>
            <Button
              type="submit"
              className={classes.sendButton + " fs-2 fw-bold"}
            >
              Envoyer
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};
export default IdentityCheck;
