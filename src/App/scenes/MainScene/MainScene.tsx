import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import { app, eventsCollection } from "../../../RealmApp";

import { CreateEventForm, CreateEventHandler } from "./CreateEventForm";
import { EventsOverview } from "./EventsOverview";
import { EventScreen } from "./EventScreen";
import { NarrowContainer } from "../../NarrowContainer";
import { TopAndSideBar } from "../../layouts/TopAndSideBar";
import { UserProfile } from "./UserProfile";

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
    <TopAndSideBar>
      <Switch>
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
        <Route exact path="/profile">
          <UserProfile />
        </Route>
      </Switch>
    </TopAndSideBar>
  );
}
