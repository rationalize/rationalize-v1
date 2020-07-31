import React from "react";
import { Container, Card, Row, Col } from "reactstrap";
import { useHistory } from "react-router-dom";

import { CreateEventForm } from "./CreateEventForm";
import { EvaluationHelp } from "./EvaluationHelp";
import { Event } from "../../../mongodb";
import { PrimaryLayout } from "../../layouts/PrimaryLayout";
import { RestrictedArea } from "../../RestrictedArea";

export function CreateEventScene() {
  const history = useHistory();

  function handleCreated(event: Event) {
    const id = event._id.toHexString();
    const { scoring } = event;
    if (scoring.facilitator || scoring.survey) {
      history.push(`/events/${id}/score`);
    } else {
      history.push(`/events/${id}`);
    }
  }

  return (
    <PrimaryLayout>
      <RestrictedArea>
        <Container>
          <Row>
            <Col md={{ size: 6, offset: 3 }}>
              <h3>
                Create New Evaluation Event <EvaluationHelp />
              </h3>
              <Card body>
                <CreateEventForm handleCreated={handleCreated} />
              </Card>
            </Col>
          </Row>
        </Container>
      </RestrictedArea>
    </PrimaryLayout>
  );
}
