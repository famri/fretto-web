import { useContext, useState, useRef } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useHistory } from "react-router";
import { updateProfileImage } from "../lib/profile-api";
import AuthContext from "../store/auth-context";
import classes from "./EditProfileImage.module.css";

export function getCroppedImg(image, crop, fileName) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  // New lines to be added
  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  // As Base64 string
  /*   const base64Image = canvas.toDataURL("image/jpeg");
  return base64Image; */

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        blob.name = fileName;
        resolve(blob);
      },
      "image/jpeg",
      1
    );
  });
}

const EditProfileImage = () => {
  const authContext = useContext(AuthContext);
  const imageCropRef = useRef();
  const [error, setError] = useState();
  const history = useHistory();

  const [imageSrc, setImageSrc] = useState();
  const [crop, setCrop] = useState({
    aspect: 1 / 1,
  });

  const handlePhotoSubmit = async (event) => {
    event.preventDefault();
    if (imageSrc) {
      let imageData = await getCroppedImg(
        imageCropRef.current.imageRef.current,
        crop,
        "profile-photo.jpg"
      );
      updateProfileImage({ image: imageData, token: authContext.token })
        .then(() => history.push("/profile"))
        .catch((error) => setError(error));
    }
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let chosenImg = event.target.files[0];

      setImageSrc(URL.createObjectURL(chosenImg));
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
        Choisissez une nouvelle photo de profil
      </h1>
      {imageSrc && (
        <div className=" d-flex justify-content-center  ">
          <ReactCrop
            ref={imageCropRef}
            keepSelection={true}
            src={imageSrc}
            crop={crop}
            imageStyle={{
              height: "undefined",
              width: "200px",
            }}
            onImageLoaded={(image) => {
              setCrop({ width: image.width, height: undefined, aspect: 1 / 1 });
              return false;
            }}
            onChange={(newCrop) => setCrop(newCrop)}
          />
        </div>
      )}

      <Form
        className="my-5 "
        onSubmit={(event) => {
          handlePhotoSubmit(event);
        }}
      >
        <Row xs={1} md={2}>
          <Col md={10}>
            <Form.Control
              required
              type="file"
              accept="image/jpg, image/jpeg"
              onChange={(event) => onImageChange(event)}
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
export default EditProfileImage;
