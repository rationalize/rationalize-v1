import React from "react";
import { Switch, Route } from "react-router-dom";

import { TopAndSideBar } from "../../layouts/TopAndSideBar";

import { EventsOverviewScene } from "./EventsOverviewScene";
import { EventScene } from "./EventScene";
import { UserProfileScene } from "./UserProfileScene";
import { CreateEventScene } from "./CreateEventScene";

export function MainScene() {
  return (
    <TopAndSideBar>
      <Switch>
        <Route exact path="/events">
          <EventsOverviewScene />
        </Route>
        <Route path="/events/create">
          <CreateEventScene />
        </Route>
        <Route path="/events/:id">
          {({ match }) => <EventScene id={match?.params.id} />}
        </Route>
        <Route exact path="/profile">
          <UserProfileScene />
        </Route>
      </Switch>
    </TopAndSideBar>
  );
}
