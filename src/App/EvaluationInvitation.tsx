import React, { useState, useEffect } from "react";
import { Credentials } from "realm-web";
import { ObjectId } from "bson";

import { Event, eventsCollection, app } from "../RealmApp";

import { NarrowContainer } from "./NarrowContainer";
import { LoadingOverlay } from "./LoadingOverlay";
import { EvaluationForm } from "./EvaluationForm";

import styles from "./EvaluationInvitation.module.scss";

export type EvaluationInvitationProps = { eventId: string };

export function EvaluationInvitation({ eventId }: EvaluationInvitationProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      if (app.currentUser === null) {
        const credentials = Credentials.anonymous();
        await app.logIn(credentials);
        // TODO: Send an invitation code as well ...
        await app.functions.acceptEventInvitation(eventId);
      }
      return eventsCollection.findOne({
        _id: { $eq: ObjectId.createFromHexString(eventId) },
      });
    })()
      .then(setEvent, setError)
      .finally(() => {
        setIsLoading(false);
      });
  }, [eventId]);

  return (
    <NarrowContainer className={styles.EvaluationInvitation}>
      <LoadingOverlay isLoading={isLoading} error={error} grow>
        {event ? (
          <>
            <h1 className={styles.EvaluationInvitation__EventName}>
              {event.name}
            </h1>
            <EvaluationForm event={event} />
          </>
        ) : null}
      </LoadingOverlay>
    </NarrowContainer>
  );
}
