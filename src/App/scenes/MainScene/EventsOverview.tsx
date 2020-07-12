import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";

import { CenteredContainer } from "./CenteredContainer";
import { EventCard } from "./EventCard";
import { LinkButton } from "../../LinkButton";
import { Event, eventsCollection, app } from "../../../RealmApp";
import { LoadingOverlay } from "../../LoadingOverlay";

export function EventsOverview() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    eventsCollection
      .find({ facilitator: { $eq: app.currentUser?.id } })
      .then(setEvents, setError)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <LoadingOverlay isLoading={isLoading} error={error} grow>
      {events.length > 0 ? (
        <>
          <Container fluid>
            <Row>
              {events.map((event) => (
                <Col md="6" lg="3" key={event._id.toHexString()}>
                  <EventCard event={event} />
                </Col>
              ))}
            </Row>
          </Container>
          <CenteredContainer>
            <LinkButton to="/events/create" color="primary">
              Create event
            </LinkButton>
          </CenteredContainer>
        </>
      ) : !isLoading ? (
        <CenteredContainer>
          <p>Concepts are evaluated at events ...</p>
          <LinkButton to="/events/create" color="primary">
            Create event
          </LinkButton>
        </CenteredContainer>
      ) : null}
    </LoadingOverlay>
  );
}
