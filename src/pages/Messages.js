import { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import useHttp from "../hooks/use-http";
import {
  loadDiscussion,
  loadDiscussionMessages,
  sendMessage,
} from "../lib/discussions-api";
import AuthContext from "../store/auth-context";
import classes from "./Messages.module.css";
const Messages = () => {
  const params = useParams();
  const authContext = useContext(AuthContext);
  const messageContent = useRef();

  const lastMessageRef = useRef();
  const [isLoadingDiscussion, setIsLoadingDiscussion] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState();

  const [error, setError] = useState();
  const [discussion, setDiscussion] = useState();
  const [hasNext, setHasNext] = useState(true);
  const [messages, setMessages] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const {
    sendRequest: sendMessageRequest,
    status: sendMessageStatus,
    error: sendMessageError,
  } = useHttp(sendMessage);

  const handleSendMessage = () => {
    if (
      messageContent.current.value &&
      messageContent.current.value.length > 0
    ) {
      sendMessageRequest({
        message: messageContent.current.value,
        discussionId: params.discussionId,
        token: authContext.token,
      });
    }
  };

  useEffect(() => {
    if (sendMessageStatus === "completed") {
      setPageNumber(0);
    }
  }, [sendMessageStatus, sendMessageError]);

  useEffect(() => {
    setIsLoadingDiscussion(true);
    loadDiscussion({
      discussionId: params.discussionId,
      token: authContext.token,
    })
      .then((discussionData) => {
        setDiscussion(discussionData);
        setIsLoadingDiscussion(false);
      })
      .then(() => {})
      .catch((error) => {
        setError(error.message);
        setIsLoadingDiscussion(false);
      });
  }, [params.discussionId, authContext.token]);

  useEffect(() => {
    setIsLoadingMessages(true);
    loadDiscussionMessages({
      page: pageNumber,
      size: 15,
      discussionId: params.discussionId,
      token: authContext.token,
    })
      .then((messagesData) => {
        setMessages((oldMessages) => [
          ...messagesData.content.reverse(),
          ...oldMessages,
        ]);
        setHasNext(messagesData.hasNext);
        setIsLoadingMessages(false);
        if (pageNumber === 0 && messagesData.content.length > 0) {
          lastMessageRef.current.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        }
      })
      .catch((error) => {
        setError(error.message);
        setIsLoadingMessages(false);
      });
  }, [params.discussionId, authContext.token, pageNumber]);

  if (isLoadingDiscussion) {
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
  return (
    <Container>
      <Card>
        <Card.Header className="d-flex justify-content-center">
          <Row xs={1} md={1}>
            <Col className="d-flex justify-content-center">
              <img
                alt={"transporter-" + params.discussionId + "-image"}
                src={discussion.transporter.photoUrl}
                className={classes.bigAvatar}
              ></img>
            </Col>
            <Col className="d-flex justify-content-center">
              <span className={classes.transporterName + " fs-2 ml-5"}>
                {discussion.transporter.name}
              </span>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className={classes.messagesCardBody}>
          {isLoadingMessages && (
            <div className="d-flex justify-content-center">
              <Spinner variant="primary" animation="border"></Spinner>
            </div>
          )}
          {!isLoadingMessages && hasNext && (
            <div className="d-flex justify-content-center">
              <Button
                className="rounded-pill"
                variant="secondary"
                onClick={() => {
                  setPageNumber(pageNumber + 1);
                }}
              >
                Charger plus
              </Button>
            </div>
          )}
          {messages.map((m, index) => {
            if (discussion.transporter.id === m.authorId) {
              if (index === 0) {
                return (
                  <Row
                    key={m.id}
                    xs={2}
                    md={2}
                    className="d-flex justify-content-start my-3"
                  >
                    <Col
                      xs={2}
                      md={1}
                      className="d-flex justify-content-start "
                    >
                      <img
                        alt={"transporter-" + params.discussionId + "-image"}
                        src={discussion.transporter.photoUrl}
                        className={classes.littleAvatar}
                      ></img>
                    </Col>
                    <Col
                      xs={10}
                      md={11}
                      className="d-flex justify-content-start "
                    >
                      <span
                        className={
                          classes.transporterMessageContent + " fs-2 ml-5"
                        }
                      >
                        {m.content}
                      </span>
                    </Col>
                  </Row>
                );
              } else if (index === messages.length - 1) {
                return (
                  <Row
                    key={m.id}
                    ref={lastMessageRef}
                    xs={2}
                    md={2}
                    className="d-flex justify-content-start my-3"
                  >
                    <Col
                      xs={2}
                      md={1}
                      className="d-flex justify-content-start "
                    >
                      <img
                        alt={"transporter-" + params.discussionId + "-image"}
                        src={discussion.transporter.photoUrl}
                        className={classes.littleAvatar}
                      ></img>
                    </Col>
                    <Col
                      xs={10}
                      md={11}
                      className="d-flex justify-content-start "
                    >
                      <span
                        className={
                          classes.transporterMessageContent + " fs-2 ml-5"
                        }
                      >
                        {m.content}
                      </span>
                    </Col>
                  </Row>
                );
              } else {
                return (
                  <Row
                    key={m.id}
                    xs={2}
                    md={2}
                    className="d-flex justify-content-start my-3"
                  >
                    <Col
                      xs={2}
                      md={1}
                      className="d-flex justify-content-start "
                    >
                      <img
                        alt={"transporter-" + params.discussionId + "-image"}
                        src={discussion.transporter.photoUrl}
                        className={classes.littleAvatar}
                      ></img>
                    </Col>
                    <Col
                      xs={10}
                      md={11}
                      className="d-flex justify-content-start "
                    >
                      <span
                        className={
                          classes.transporterMessageContent + " fs-2 ml-5"
                        }
                      >
                        {m.content}
                      </span>
                    </Col>
                  </Row>
                );
              }
            } else {
              if (index === 0) {
                return (
                  <Row
                    key={m.id}
                    xs={2}
                    md={2}
                    className="d-flex justify-content-end my-3"
                  >
                    <Col
                      xs={10}
                      md={11}
                      className="d-flex justify-content-end "
                    >
                      <span
                        className={classes.clientMessageContent + " fs-2 ml-5"}
                      >
                        {m.content}
                      </span>
                    </Col>
                    <Col xs={2} md={1} className="d-flex justify-content-end ">
                      <img
                        alt={"client-" + params.discussionId + "-image"}
                        src={discussion.client.photoUrl}
                        className={classes.littleAvatar}
                      ></img>
                    </Col>
                  </Row>
                );
              } else if (index === messages.length - 1) {
                return (
                  <Row
                    key={m.id}
                    ref={lastMessageRef}
                    xs={2}
                    md={2}
                    className="d-flex justify-content-end my-3"
                  >
                    <Col
                      xs={10}
                      md={11}
                      className="d-flex justify-content-end "
                    >
                      <span
                        className={classes.clientMessageContent + " fs-2 ml-5"}
                      >
                        {m.content}
                      </span>
                    </Col>
                    <Col xs={2} md={1} className="d-flex justify-content-end ">
                      <img
                        alt={"client-" + params.discussionId + "-image"}
                        src={discussion.client.photoUrl}
                        className={classes.littleAvatar}
                      ></img>
                    </Col>
                  </Row>
                );
              } else {
                return (
                  <Row
                    key={m.id}
                    xs={2}
                    md={2}
                    className="d-flex justify-content-end my-3"
                  >
                    <Col
                      xs={10}
                      md={11}
                      className="d-flex justify-content-end "
                    >
                      <span
                        className={classes.clientMessageContent + " fs-2 ml-5"}
                      >
                        {m.content}
                      </span>
                    </Col>
                    <Col xs={2} md={1} className="d-flex justify-content-end ">
                      <img
                        alt={"client-" + params.discussionId + "-image"}
                        src={discussion.client.photoUrl}
                        className={classes.littleAvatar}
                      ></img>
                    </Col>
                  </Row>
                );
              }
            }
          })}
        </Card.Body>
        <Card.Footer>
          <Row xs={1} md={1} className="d-flex justify-content-center my-3">
            <Col xs={12} md={12}>
              <Row xs={1} md={1}>
                {!!sendMessageError && (
                  <Col className="error d-flex justify-content-center fs-2 my-5">
                    {sendMessageError}
                  </Col>
                )}
              </Row>
            </Col>
            <Col xs={12} md={12}>
              <Row xs={2} md={2}>
                <Col xs={9} md={11} className="">
                  <Form.Control
                    ref={messageContent}
                    type="text"
                    as="textarea"
                    rows={2}
                  ></Form.Control>
                </Col>
                <Col xs={3} md={1} className="my-auto">
                  <Button
                    className="fs-2 fw-bold"
                    onClick={() => {
                      handleSendMessage();
                    }}
                    disabled={sendMessageStatus === "pending"}
                  >
                    Envoyer
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Messages;
