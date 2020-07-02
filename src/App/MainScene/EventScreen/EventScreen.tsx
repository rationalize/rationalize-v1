import React, { useEffect, useState } from "react";
import { FormGroup, Label } from "reactstrap";
import { Switch, Route, Redirect } from "react-router-dom";
import { ObjectId } from "bson";
import { Credentials } from "realm-web";

import { Event, eventsCollection, app } from "../../../RealmApp";

import { LinkButton } from "../../LinkButton";
import { NarrowContainer } from "../NarrowContainer";
import { LoadingOverlay } from "../../LoadingOverlay";
import { CopyToClipboardInput } from "../../CopyToClipboardInput";

import styles from "./EventScreen.module.scss";
import { EvaluationForm } from "./EvaluationForm";
import { EventResult } from "./EventResult";

type EventScreenProps = { id: string };

export function EventScreen({ id }: EventScreenProps) {
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
    <LoadingOverlay isLoading={isLoading} error={error}>
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
            <Route path="/events/:id/result">
              {() => (
                <NarrowContainer>
                  <EventResult event={event} />
                </NarrowContainer>
              )}
            </Route>
            {app.currentUser?.id === event.facilitator ? (
              <Route exact path="/events/:id">
                <NarrowContainer>
                  <FormGroup>
                    <Label for="evaluation-link">
                      Send this link to participants:
                    </Label>
                    <CopyToClipboardInput
                      id="evaluation-link"
                      text={global.location.href + "/evaluate"}
                    />
                  </FormGroup>
                  <LinkButton
                    to={`/events/${event._id.toHexString()}/result`}
                    color="primary"
                  >
                    Go to result
                  </LinkButton>
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
