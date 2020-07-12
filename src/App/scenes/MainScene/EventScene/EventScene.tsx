import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ObjectId } from "bson";
import { Credentials } from "realm-web";

import { Event, eventsCollection, app } from "../../../../RealmApp";
import { NarrowContainer } from "../../../NarrowContainer";
import { LoadingOverlay } from "../../../LoadingOverlay";

import styles from "./EventScreen.module.scss";
import { EvaluationForm } from "../../../EvaluationForm";
import { EventOverview } from "./EventOverview";

type EventSceneProps = { id: string };

export function EventScene({ id }: EventSceneProps) {
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
        await app.functions.acceptEventInvitation(id);
      }
      return eventsCollection.findOne({
        _id: { $eq: ObjectId.createFromHexString(id) },
      });
    })()
      .then(setEvent, setError)
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return (
    <LoadingOverlay isLoading={isLoading} error={error} grow>
      {event ? (
        <>
          <h1 className={styles.EventScreen__Heading}>{event.name}</h1>
          <Switch>
            <Route path="/events/:id/evaluate">
              {() => (
                <NarrowContainer>
                  <EvaluationForm event={event} />
                </NarrowContainer>
              )}
            </Route>
            {app.currentUser?.id === event.facilitator ? (
              <Route exact path="/events/:id">
                <NarrowContainer>
                  <EventOverview event={event} />
                </NarrowContainer>
              </Route>
            ) : (
              <Route>
                <Redirect to="/log-in" />
              </Route>
            )}
          </Switch>
        </>
      ) : null}
    </LoadingOverlay>
  );
}
