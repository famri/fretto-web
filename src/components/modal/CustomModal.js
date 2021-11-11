import { Modal, Button } from "react-bootstrap";
const CustomModal = (props) => {
  return (
    <Modal
      className="fs-2"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header className={props.headerClassName} closeButton> 
        <Modal.Title
          id="contained-modal-title-vcenter"
          className={props.titleClassName + " fs-1"}
        >
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props.description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className="fs-2 " onClick={props.onActionClick}>
          {props.actionName}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
