import React, { useState, useEffect } from "react";
import { Alert, Spinner } from "reactstrap";

import { CenteredContainer } from "./CenteredContainer";
import { NarrowContainer } from "./NarrowContainer";
import { EventCard } from "./EventCard";
import { LinkButton } from "../LinkButton";
import { Event, eventsCollection, app } from "../../RealmApp";
import { LoadingOverlay } from "../LoadingOverlay";

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
    <LoadingOverlay isLoading={isLoading} error={error}>
      {events.length === 0 ? (
        <CenteredContainer>
          <p>Concepts are evaluated at events ...</p>
          <LinkButton to="/events/create" color="primary">
            Start by creating an event
          </LinkButton>
        </CenteredContainer>
      ) : (
        <NarrowContainer>
          {events.map((event) => (
            <EventCard key={event._id.toHexString()} event={event} />
          ))}
          <LinkButton to="/events/create" color="primary" block>
            Create another event
          </LinkButton>
        </NarrowContainer>
      )}
    </LoadingOverlay>
  );
}
