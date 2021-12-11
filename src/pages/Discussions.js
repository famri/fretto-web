import { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Pagination,
  Row,
  Spinner
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import DiscussionsLayout from "../components/layout/DiscussionsLayout";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import { loadDiscussions } from "../lib/discussions-api";
import AuthContext from "../store/auth-context";
import {
  WebSocketContext,
  WebSocketContextMethods
} from "../store/websocket-context";
import classes from "./Discussions.module.css";
const PAGE_SIZE = 25;
const Discussions = () => {
  const authCtx = useContext(AuthContext);
  const webSocketContext = useContext(WebSocketContext);
  const webSocketContextMethods = useContext(WebSocketContextMethods);

  const history = useHistory();
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  const [sortCriterion, setSortCriterion] = useState("date-time,desc");
  const [filterCriterion, setFilterCriterion] = useState("active:true");
  const [filterTitle, setFilterTitle] = useState("Active");
  const [sortTitle, setSortTitle] = useState("Plus récent en premier");

  const [filterItems] = useState([{ key: "active:true", name: "Active" }]);

  const [sortItems] = useState([
    { key: "date-time,desc", name: "Plus récent en premier" },
    { key: "date-time,asc", name: "Plus ancien en premierr" },
  ]);

  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState();

  const onFilterChosen = (eventKey) => {
    setFilterTitle(filterItems.find((item) => item.key === eventKey).name);
    setFilterCriterion(eventKey);
  };

  const onSortChosen = (eventKey) => {
    setSortTitle(sortItems.find((item) => item.key === eventKey).name);
    setSortCriterion(eventKey);
  };

  useEffect(() => {
    setIsLoading(true);
    loadDiscussions({
      page: pageNumber,
      size: PAGE_SIZE,
      filter: filterCriterion,
      sort: sortCriterion,
      token: authCtx.token,
    })
      .then((discussions) => {
        webSocketContextMethods.updateCurrentDiscussions(discussions.content);
        setTotalPages(discussions.totalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [
    pageNumber,
    authCtx.token,
    filterCriterion,
    sortCriterion,
    webSocketContextMethods,
  ]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center my-auto">
        <LoadingSpinner></LoadingSpinner>
      </Container>
    );
  }
  if (!!error) {
    return (
      <Container>
        <h1 className="d-flex justify-content-center my-auto error">{error}</h1>
      </Container>
    );
  }

  let pagingItems = [];
  for (let number = 1; number <= totalPages; number++) {
    pagingItems.push(
      <Pagination.Item
        key={number}
        active={number - 1 === pageNumber}
        onClick={() => setPageNumber(number - 1)}
        style={{ cursor: "pointer" }}
      >
        {number}
      </Pagination.Item>
    );
  }

  if (webSocketContext.currentDiscussions.length === 0) {
    return (
      <Container>
        <DiscussionsLayout
          filterTitle={filterTitle}
          filterItems={filterItems}
          sortTitle={sortTitle}
          sortItems={sortItems}
          onFilterChosen={onFilterChosen}
          onSortChosen={onSortChosen}
          pagingItems={pagingItems}
        >
          <h1 className="d-flex justify-content-center my-auto">
            Vous n'avez pas de demande de trajet pour cette période.
          </h1>
        </DiscussionsLayout>
      </Container>
    );
  } else {
    return (
      <Container>
        <DiscussionsLayout
          filterTitle={filterTitle}
          filterItems={filterItems}
          sortTitle={sortTitle}
          sortItems={sortItems}
          onFilterChosen={onFilterChosen}
          onSortChosen={onSortChosen}
          pagingItems={pagingItems}
        >
          <Row
            xs={1}
            md={2}
            className={"g-" + webSocketContext.currentDiscussions.length}
          >
            {webSocketContext.currentDiscussions.map((d, index) => (
              <Col key={d.id}>
                <Card className={classes.journeyCard + " my-3 mx-0 "}>
                  <Card.Body>
                    <Card.Title>
                      <Row xs={2} md={2}>
                        <Col xs={3} md={2} key={d.id + "-avatar"}>
                          <img
                            alt={
                              authCtx.isClient
                                ? "transporter-" + index + "-image"
                                : "client-" + index + "-image"
                            }
                            src={
                              authCtx.isClient
                                ? d.transporter.photoUrl
                                : d.client.photoUrl
                            }
                            className={classes.avatar}
                          ></img>
                        </Col>
                        <Col xs={9} md={10} key={d.id + "-transporter-info"}>
                          <span className={classes.interlocutorName + " ml-5"}>
                            {authCtx.isClient
                              ? d.transporter.name
                              : d.client.name}
                          </span>
                        </Col>
                      </Row>
                    </Card.Title>
                    <Card.Subtitle
                      className={
                        (d.latestMessage.authorId !== authCtx.oauthId &&
                        !d.latestMessage.read
                          ? classes.messageContentUnread
                          : classes.messageContentRead) + " fs-3 fst-italic"
                      }
                    >
                      <Row xs={4} md={4}>
                        <Col xs={3} md={2}>
                          {d.latestMessage.authorId === authCtx.oauthId &&
                            "Vous:"}
                        </Col>
                        <Col xs={4} md={6}>
                          {d.latestMessage.content}
                        </Col>
                        <Col xs={4} md={3}>
                          <Row xs={1} md={1}>
                            <Col xs={12} md={12}>
                              {new Intl.DateTimeFormat("fr-FR", {
                                dateStyle: "short",
                              }).format(new Date(d.latestMessage.dateTime))}
                            </Col>
                            <Col xs={12} md={12}>
                              {new Intl.DateTimeFormat("fr-FR", {
                                timeStyle: "short",
                              }).format(new Date(d.latestMessage.dateTime))}
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={1} md={1}>
                          {d.latestMessage.authorId !== authCtx.oauthId &&
                            !d.latestMessage.read && (
                              <Spinner
                                variant="primary"
                                animation="grow"
                                size="sm"
                              ></Spinner>
                            )}
                        </Col>
                      </Row>
                    </Card.Subtitle>
                    <Card.Text></Card.Text>
                  </Card.Body>

                  <Card.Footer className="d-flex justify-content-around">
                    <Button
                      className={classes.journeyButton + " fw-bold fs-4 col-12"}
                      variant="primary"
                      onClick={() => {
                        history.push("/discussions/" + d.id + "/messages");
                      }}
                    >
                      Reprendre
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </DiscussionsLayout>
      </Container>
    );
  }
};
export default Discussions;
