import React from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";

import { app, eventsCollection } from "../../RealmApp";

import { TopBar } from "./TopBar";
import { CreateEventForm, CreateEventHandler } from "./CreateEventForm";
import { EventsOverview } from "./EventsOverview";
import { EventScreen } from "./EventScreen";

import styles from "./MainScene.module.scss";
import { NarrowContainer } from "./NarrowContainer";

export function MainScene() {
  const history = useHistory();

  const handleCreateEvent: CreateEventHandler = async (values, helpers) => {
    if (app.currentUser) {
      const event = await eventsCollection.insertOne({
        ...values,
        participants: [],
        facilitator: app.currentUser.id,
      });
      helpers.setSubmitting(false);
      history.push(`/events/${event.insertedId.toHexString()}`);
    }
  };

  return (
    <div className={styles.MainScene}>
      <TopBar className={styles.MainScene__TopBar} />
      <Switch>
        <Route exact path="/">
          <Redirect to="/events" />
        </Route>
        <Route exact path="/events">
          <EventsOverview />
        </Route>
        <Route path="/events/create">
          <NarrowContainer>
            <CreateEventForm handleCreateEvent={handleCreateEvent} />
          </NarrowContainer>
        </Route>
        <Route path="/events/:id">
          {({ match }) => <EventScreen id={match?.params.id} />}
        </Route>
      </Switch>
    </div>
  );
}
