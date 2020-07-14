import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Card } from "reactstrap";

import { CenteredContainer } from "./CenteredContainer";
import { LinkButton } from "../../LinkButton";
import { Event, eventsCollection, app } from "../../../RealmApp";
import { LoadingOverlay } from "../../LoadingOverlay";
import { useHistory } from "react-router";

import styles from "./EventsOverviewScene.module.scss";

export function EventsOverviewScene() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    eventsCollection
      .find({ facilitator: { $eq: app.currentUser?.id } })
      .then(setEvents, setError)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function goToEvent(event: Event) {
    history.push(`/events/${event._id.toHexString()}`);
  }

  function handleClick(event: Event) {
    goToEvent(event);
  }

  function handleKeyUp(
    event: Event,
    e: React.KeyboardEvent<HTMLTableRowElement>
  ) {
    if (e.key === "Enter") {
      goToEvent(event);
    }
  }

  return (
    <LoadingOverlay isLoading={isLoading} error={error} grow>
      {events.length > 0 ? (
        <>
          <Container>
            <Row>
              <Col md={{ size: 8, offset: 2 }}>
                <h3>Events</h3>
                <Card body>
                  <Table>
                    <thead>
                      <tr>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr
                          key={event._id.toHexString()}
                          className={styles.EventsOverviewScene__EventRow}
                          onClick={handleClick.bind(null, event)}
                          onKeyUp={handleKeyUp.bind(null, event)}
                          tabIndex={0}
                        >
                          <td>{event.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <LinkButton to="/events/create" color="primary">
                    Create event
                  </LinkButton>
                </Card>
              </Col>
            </Row>
          </Container>
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
