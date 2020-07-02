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
      const criteria = values.criteria.filter((c) => c.name);
      const alternatives = values.alternatives.filter((a) => a.name);
      if (criteria.length === 0) {
        helpers.setFieldError(
          "criteria",
          "The must be at least one criterion."
        );
      }
      if (alternatives.length === 0) {
        helpers.setFieldError(
          "alternatives",
          "The must be at least one alternative."
        );
      }
      const event = await eventsCollection.insertOne({
        facilitator: app.currentUser.id,
        participants: values.participate ? [app.currentUser.id] : [],
        evaluations: {},
        name: values.name,
        criteria,
        alternatives,
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
