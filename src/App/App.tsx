import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { handleAuthRedirect } from "realm-web";
import { createBrowserHistory } from "history";

import { app } from "../RealmApp";
import { LogInScene } from "./scenes/LogInScene";
import { MainScene } from "./scenes/MainScene";
import { RegisterScene } from "./scenes/RegisterScene";
import { EvaluationInvitation } from "./EvaluationInvitation";
import {
  AuthenticationProvider,
  AuthenticationConsumer,
} from "./AuthenticationContext";
import { OnboardingScene } from "./scenes/OnboardingScene";
import { ResetPasswordScene } from "./scenes/ResetPasswordScene";

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
          <Route path="/events/:id/invite">
            {({ match }) => <EvaluationInvitation eventId={match?.params.id} />}
          </Route>
          <Route path="/log-in" component={LogInScene} />
          <Route path="/register" component={RegisterScene} />
          <Route path="/onboarding" component={OnboardingScene} />
          <Route path="/reset-password" component={ResetPasswordScene} />
          <Route path="/facebook-callback" component={OAuthCallback} />
          <Route path="/google-callback" component={OAuthCallback} />
          <AuthenticationConsumer>
            {({ user }) =>
              user ? (
                <>
                  <Route exact path="/">
                    <Redirect to="/events" />
                  </Route>
                  <Route>
                    <MainScene />
                  </Route>
                </>
              ) : (
                <Redirect to={"/log-in"} />
              )
            }
          </AuthenticationConsumer>
        </Switch>
      </AuthenticationProvider>
    </Router>
  );
}
