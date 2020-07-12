import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

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

export function App() {
  return (
    <Router>
      <AuthenticationProvider app={app}>
        <Switch>
          <Route path="/events/:id/invite">
            {({ match }) => <EvaluationInvitation eventId={match?.params.id} />}
          </Route>
          <Route path="/log-in" component={LogInScene} />
          <Route path="/register" component={RegisterScene} />
          <Route path="/onboarding" component={OnboardingScene} />
          <Route path="/reset-password" component={ResetPasswordScene} />
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
