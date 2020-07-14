import React from "react";
import { Container, Row, Col, Card } from "reactstrap";
import { CreateEventForm } from "./CreateEventForm";
import { useHistory } from "react-router-dom";

export function CreateEventScene() {
  const history = useHistory();
  function handleCreated(id: Realm.ObjectId) {
    history.push(`/events/${id.toHexString()}`);
  }
  return (
    <Container>
      <Row>
        <Col md={{ size: 8, offset: 2 }}>
          <h3>Create an evaluation event</h3>
          <Card body>
            <CreateEventForm handleCreated={handleCreated} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
