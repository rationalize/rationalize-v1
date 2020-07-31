import React, { useState, useEffect } from "react";
import { Container, Table, Card } from "reactstrap";
import { useHistory } from "react-router";

import { Event, eventsCollection, app } from "../../../mongodb";
import { CenteredContainer } from "../../CenteredContainer";
import { LinkButton } from "../../LinkButton";
import { LoadingOverlay } from "../../LoadingOverlay";
import { PrimaryLayout } from "../../layouts/PrimaryLayout";

import styles from "./EventsListScene.module.scss";
import { RestrictedArea } from "../../RestrictedArea";

export function EventsListScene() {
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
    <PrimaryLayout>
      <RestrictedArea>
        <LoadingOverlay isLoading={isLoading} error={error} grow>
          {events.length > 0 ? (
            <>
              <Container fluid>
                <h3>Events</h3>
                <Card body>
                  <Table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Participants</th>
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
                          <td>{event.participants.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <LinkButton to="/events/create" color="primary">
                    Create event
                  </LinkButton>
                </Card>
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
      </RestrictedArea>
    </PrimaryLayout>
  );
}
