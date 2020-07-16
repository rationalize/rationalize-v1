import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { PrimaryLayout } from "../../layouts/PrimaryLayout";

import { EventsOverviewScene } from "./EventsOverviewScene";
import { EventScene } from "./EventScene";
import { UserProfileScene } from "./UserProfileScene";
import { CreateEventScene } from "./CreateEventScene";
import { ContentfulPage } from "../../../Contentful";
import { Container } from "reactstrap";
import { AuthenticationConsumer } from "../../AuthenticationContext";

export function MainScene() {
  return (
    <AuthenticationConsumer>
      {({ user }) => (
        <PrimaryLayout sidebar={user ? "visible" : "hidden"}>
          <Switch>
            {user && (
              <Route exact path="/">
                <Redirect to="/events" />
              </Route>
            )}
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
            <Route path="/:slug">
              <Container fluid>
                <ContentfulPage />
              </Container>
            </Route>
          </Switch>
        </PrimaryLayout>
      )}
    </AuthenticationConsumer>
  );
}
