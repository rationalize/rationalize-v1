import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { PrimaryLayout } from "../../layouts/PrimaryLayout";

import { EventsOverviewScene } from "./EventsOverviewScene";
import { EventScene } from "./EventScene";
import { UserProfileScene } from "./UserProfileScene";
import { CreateEventScene } from "./CreateEventScene";
import { ContentfulPage } from "../../../Contentful";
import { AuthenticationConsumer } from "../../AuthenticationContext";
import { RestrictedArea } from "../../RestrictedArea";

export function MainScene() {
  return (
    <AuthenticationConsumer>
      {({ user }) => (
        <PrimaryLayout sidebar={user ? "visible" : "hidden"}>
          <Switch>
            <Route exact path="/">
              <RestrictedArea>
                <Redirect to="/events" />
              </RestrictedArea>
            </Route>
            <Route exact path="/profile">
              <RestrictedArea>
                <UserProfileScene />
              </RestrictedArea>
            </Route>
            <Route exact path="/events">
              <RestrictedArea>
                <EventsOverviewScene />
              </RestrictedArea>
            </Route>
            <Route exact path="/events/create">
              <RestrictedArea>
                <CreateEventScene />
              </RestrictedArea>
            </Route>
            <Route path="/events/:id">
              {({ match }) => <EventScene id={match?.params.id} />}
            </Route>
            <Route path="/:slug">
              <ContentfulPage />
            </Route>
          </Switch>
        </PrimaryLayout>
      )}
    </AuthenticationConsumer>
  );
}
