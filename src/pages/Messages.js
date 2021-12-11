import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
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
  updateMessageReadStatus,
} from "../lib/discussions-api";
import AuthContext from "../store/auth-context";
import {
  WebSocketContext,
  WebSocketContextMethods,
} from "../store/websocket-context";
import classes from "./Messages.module.css";

const Messages = (props) => {
  const params = useParams();
  const authContext = useContext(AuthContext);
  const [messageContent, setMessageContent] = useState("");
  const webSocketContextMethods = useContext(WebSocketContextMethods);
  const webSocketContext = useContext(WebSocketContext);

  const lastMessageRef = useRef(null);

  const [isLoadingDiscussion, setIsLoadingDiscussion] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const [error, setError] = useState();
  const [discussion, setDiscussion] = useState();
  const [hasNext, setHasNext] = useState(true);

  const [pageNumber, setPageNumber] = useState(0);

  const {
    sendRequest: sendMessageRequest,
    status: sendMessageStatus,
    data: sentMessageData,
    error: sendMessageError,
  } = useHttp(sendMessage);

  const handleSendMessage = () => {
    if (messageContent.length > 0) {
      sendMessageRequest({
        message: messageContent,
        discussionId: params.discussionId,
        token: authContext.token,
      });
    }
  };

  const handleLastMessageRef = useCallback(
    (node) => {
      if (lastMessageRef.current) {
      }
      if (node && pageNumber === 0) {
        setTimeout(
          () =>
            node.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            }),
          300
        );

        const lastMessage = webSocketContext.currentDiscussionMessages.find(
          (e, index) =>
            index === webSocketContext.currentDiscussionMessages.length - 1
        );

        if (lastMessage.authorId !== authContext.oauthId && !lastMessage.read) {
          updateMessageReadStatus({
            token: authContext.token,
            discussionId: params.discussionId,
            messageId: lastMessage.id,
            isRead: true,
          })
            .then(() => webSocketContextMethods.decrementMissedMessagesCount())
            .catch((error) =>
              console.log("error when update message read status: \n" + error)
            );
        }
      }
      lastMessageRef.current = node;
    },
    [
      pageNumber,
      authContext.token,
      params.discussionId,
      webSocketContext.currentDiscussionMessages,
      authContext.oauthId,
      webSocketContextMethods,
    ]
  );
  useEffect(() => {
    if (
      sendMessageStatus === "completed" &&
      !sendMessageError &&
      sentMessageData
    ) {
      webSocketContextMethods.insertIntoCurrentDiscussionMessages(
        sentMessageData
      );
      setMessageContent("");
    }
  }, [
    sendMessageStatus,
    sendMessageError,
    webSocketContextMethods,
    sentMessageData,
  ]);

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
        webSocketContextMethods.updateCurrentDiscussionMessages(
          messagesData.content,
          pageNumber === 0
        );
        setHasNext(messagesData.hasNext);
        setIsLoadingMessages(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoadingMessages(false);
      });
  }, [
    params.discussionId,
    authContext.token,
    pageNumber,
    webSocketContextMethods,
  ]);

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
                alt={
                  authContext.isClient ? "transporter-avatar" : "client-avatar"
                }
                src={
                  authContext.isClient
                    ? discussion.transporter.photoUrl
                    : discussion.client.photoUrl
                }
                className={classes.bigAvatar}
              ></img>
            </Col>
            <Col className="d-flex justify-content-center">
              <span className={classes.interlocutorName + " fs-2 ml-5"}>
                {authContext.isClient
                  ? discussion.transporter.name
                  : discussion.client.name}
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
          {!isLoadingMessages &&
            webSocketContext.currentDiscussionMessages.map((m, index) => {
              if (authContext.oauthId !== m.authorId) {
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
                          alt="interlocutor-avatar"
                          src={
                            authContext.isClient
                              ? discussion.transporter.photoUrl
                              : discussion.client.photoUrl
                          }
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
                            classes.interlocutorMessageContent + " fs-2 ml-5"
                          }
                        >
                          {m.content}
                        </span>
                      </Col>
                    </Row>
                  );
                } else if (
                  index ===
                  webSocketContext.currentDiscussionMessages.length - 1
                ) {
                  return (
                    <Row
                      ref={handleLastMessageRef}
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
                          alt="interlocutor-avatar"
                          src={
                            authContext.isClient
                              ? discussion.transporter.photoUrl
                              : discussion.client.photoUrl
                          }
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
                            classes.interlocutorMessageContent + " fs-2 ml-5"
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
                          alt="interlocutor-avatar"
                          src={
                            authContext.isClient
                              ? discussion.transporter.photoUrl
                              : discussion.client.photoUrl
                          }
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
                            classes.interlocutorMessageContent + " fs-2 ml-5"
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
                          className={classes.ownMessageContent + " fs-2 ml-5"}
                        >
                          {m.content}
                        </span>
                      </Col>
                      <Col
                        xs={2}
                        md={1}
                        className="d-flex justify-content-end "
                      >
                        <img
                          alt="my-avatar"
                          src={
                            authContext.isClient
                              ? discussion.client.photoUrl
                              : discussion.transporter.photoUrl
                          }
                          className={classes.littleAvatar}
                        ></img>
                      </Col>
                    </Row>
                  );
                } else if (
                  index ===
                  webSocketContext.currentDiscussionMessages.length - 1
                ) {
                  return (
                    <Row
                      ref={handleLastMessageRef}
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
                          className={classes.ownMessageContent + " fs-2 ml-5"}
                          id={m.id}
                        >
                          {m.content}
                        </span>
                      </Col>
                      <Col
                        xs={2}
                        md={1}
                        className="d-flex justify-content-end "
                      >
                        <img
                          alt="my-avatar"
                          src={
                            authContext.isClient
                              ? discussion.client.photoUrl
                              : discussion.transporter.photoUrl
                          }
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
                          className={classes.ownMessageContent + " fs-2 ml-5"}
                        >
                          {m.content}
                        </span>
                      </Col>
                      <Col
                        xs={2}
                        md={1}
                        className="d-flex justify-content-end "
                      >
                        <img
                          alt="my-avatar"
                          src={
                            authContext.isClient
                              ? discussion.client.photoUrl
                              : discussion.transporter.photoUrl
                          }
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
              <InputGroup>
                <Form.Control
                  onChange={(event) => setMessageContent(event.target.value)}
                  type="text"
                  as="textarea"
                  rows={2}
                ></Form.Control>

                <Button
                  variant="outline-secondary"
                  className={
                    classes.sendMessageButton + " mx-2 fs-2 fw-bold fst-italic"
                  }
                  onClick={() => {
                    handleSendMessage();
                  }}
                  disabled={sendMessageStatus === "pending"}
                >
                  Envoyer
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Messages;
