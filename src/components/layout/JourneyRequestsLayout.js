import { Card, Dropdown, Pagination } from "react-bootstrap";

const JourneyRequestsLayout = (props) => {
  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-end ">
          <Dropdown
            className="mx-2"
            onSelect={(eventKey) => {
              props.onPeriodChosen(eventKey);
            }}
          >
            <Dropdown.Toggle
              variant="primary"
              id="dropdown-period"
              className="fs-2 fw-bold"
            >
              {props.periodTitle}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {props.periodItems.map((item) => (
                <Dropdown.Item key={item.key} eventKey={item.key}>
                  <span className="fs-3">{item.name}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            onSelect={(eventKey) => {
              props.onSortChosen(eventKey);
            }}
          >
            <Dropdown.Toggle
              variant="primary"
              id="dropdown-sort"
              className="fs-2 fw-bold"
            >
              {props.sortTitle}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {props.sortItems.map((item) => (
                <Dropdown.Item key={item.key} eventKey={item.key}>
                  <span className="fs-3"> {item.name}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Card.Header>
      <Card.Body>{props.children}</Card.Body>
      <Card.Footer>
        <Pagination size="lg" className="centered">
          {props.pagingItems}
        </Pagination>
      </Card.Footer>
    </Card>
  );
};

export default JourneyRequestsLayout;
