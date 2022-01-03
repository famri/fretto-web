import { Card, Dropdown, Pagination, Col, Row } from "react-bootstrap";

const TransporterProposalsLayout = (props) => {
  return (
    <Card>
      <Card.Header>
        <Row className="d-flex flex-sm-column flex-md-row justify-content-md-end">
          <Col className="mb-2 col-auto ">
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
          </Col>
          <Col className="mb-2 col-auto  ">
            <Dropdown
              className="mx-2"
              onSelect={(eventKey) => {
                props.onStatusChosen(eventKey);
              }}
            >
              <Dropdown.Toggle
                variant="primary"
                id="dropdown-period"
                className="fs-2 fw-bold"
              >
                {props.statusTitle}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {props.statusItems.map((item) => (
                  <Dropdown.Item key={item.key} eventKey={item.key}>
                    <span className="fs-3">{item.name}</span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col className="mb-2 col-auto ">
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
          </Col>
        </Row>
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

export default TransporterProposalsLayout;
