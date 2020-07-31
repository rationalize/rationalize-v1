import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { handleAuthRedirect } from "realm-web";
import { createBrowserHistory } from "history";

import { app } from "../mongodb";
import { AuthenticationProvider } from "./AuthenticationContext";

import { LogInScene } from "./scenes/LogInScene";
import { RegisterScene } from "./scenes/RegisterScene";
import { OnboardingScene } from "./scenes/OnboardingScene";
import { ResetPasswordScene } from "./scenes/ResetPasswordScene";
import { CreateEventScene } from "./scenes/CreateEventScene";
import { UserProfileScene } from "./scenes/UserProfileScene";
import { EventsListScene } from "./scenes/EventsListScene";
import { EventOverviewScene } from "./scenes/EventOverviewScene";
import { ScoringScene } from "./scenes/ScoringScene";
import { ContentfulScene } from "./scenes/ContentfulScene";
import { AcceptScoringInvitationScene } from "./scenes/AcceptScoringInvitationScene";

const history = createBrowserHistory();

history.listen((location) => {
  gtag("config", GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
    page_path: location.pathname,
  });
});

function OAuthCallback() {
  useEffect(() => {
    handleAuthRedirect();
  }, []);
  return null;
}

export function App() {
  return (
    <Router history={history}>
      <AuthenticationProvider app={app}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/events" />
          </Route>
          <Route path="/log-in" component={LogInScene} />
          <Route path="/register" component={RegisterScene} />
          <Route path="/onboarding" component={OnboardingScene} />
          <Route path="/reset-password" component={ResetPasswordScene} />
          <Route path="/facebook-callback" component={OAuthCallback} />
          <Route path="/google-callback" component={OAuthCallback} />
          <Route exact path="/profile" component={UserProfileScene} />
          <Route exact path="/events" component={EventsListScene} />
          <Route exact path="/events/create" component={CreateEventScene} />
          <Route exact path="/events/:id" component={EventOverviewScene} />
          <Route exact path="/events/:id/score" component={ScoringScene} />
          <Route
            exact
            path="/events/:id/score/:token"
            component={AcceptScoringInvitationScene}
          />
          <Route path="/:slug" component={ContentfulScene} />
        </Switch>
      </AuthenticationProvider>
    </Router>
  );
}
