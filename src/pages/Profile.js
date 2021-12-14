import { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import AboutSection from "../components/about-section/AboutSection";
import EmailSection from "../components/email-section/EmailSection";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import useHttp from "../hooks/use-http";
import { loadProfileInfo } from "../lib/profile-api";
import AuthContext from "../store/auth-context";
import classes from "./Profile.module.css";
import SuccessModal from "../components/modal/SuccessModal";
import MobileSection from "../components/mobile-section/MobileSection";
import { useHistory } from "react-router";
const Profile = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const {
    sendRequest: sendLoadProfileInfo,
    status,
    data,
    error,
  } = useHttp(loadProfileInfo, true);

  useEffect(() => {
    sendLoadProfileInfo({ token: authContext.token, locale: "fr_FR" });
  }, [sendLoadProfileInfo, authContext.token]);

  if (status === "pending") {
    return (
      <Container className="d-flex justify-content-center my-auto">
        <LoadingSpinner></LoadingSpinner>
      </Container>
    );
  }

  if (!!error) {
    return (
      <h1 className="error d-flex justify-content-center my-auto">{error}</h1>
    );
  }

  if (status === "completed") {
    return (
      <Container>
        <Card className="my-5">
          <Card.Header className="d-flex justify-content-center">
            <Row xs={1} md={1}>
              <Col className="d-flex justify-content-center">
                <img
                  onClick={() => {
                    history.push("/profile/edit-profile-image");
                  }}
                  alt={"user-profile"}
                  src={data.photoUrl}
                  className={classes.bigAvatar}
                ></img>
              </Col>
              <Col className="d-flex justify-content-center">
                <span className={classes.userName + " fs-2 ml-5"}>
                  {data.name.firstname + " " + data.name.lastname.toUpperCase()}
                </span>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <AboutSection
              aboutData={{
                genderId: data.gender.id,
                firstname: data.name.firstname,
                lastname: data.name.lastname.toUpperCase(),
                dateOfBirth: data.dateOfBirth,
                minibio: data.miniBio,
                validationInfo: {
                  state: data.name.validationInfo.state,
                  isValidated: data.name.validationInfo.isValidated,
                },
              }}
              afterUpdateCallback={() =>
                sendLoadProfileInfo({
                  token: authContext.token,
                  locale: "fr_FR",
                })
              }
            ></AboutSection>

            <hr className={classes.hrLine + " my-5 mx-5 "} />
            <EmailSection
              emailData={{ email: data.email.value }}
              afterUpdateCallback={() => setShowSuccessModal(true)}
            ></EmailSection>

            <hr className={classes.hrLine + " my-5 mx-5 "} />

            <MobileSection
              mobileData={{
                iccId: data.mobile.icc.id,
                mobileNumber: data.mobile.value,
                checked: data.mobile.checked,
              }}
              afterUpdateCallback={() =>
                sendLoadProfileInfo({
                  token: authContext.token,
                  locale: "fr_FR",
                })
              }
            ></MobileSection>
          </Card.Body>
        </Card>
        <SuccessModal
          show={showSuccessModal}
          title="Votre email a été mis à jour avec succès."
          description="Veuillez vous reconnecter avec la nouvelle adresse email."
          onActionClick={() => {
            setShowSuccessModal(false);
            authContext.logout();
          }}
          onHide={() => {
            setShowSuccessModal(false);
            authContext.logout();
          }}
          actionName="OK"
        ></SuccessModal>
      </Container>
    );
  }
};

export default Profile;
