import React, { useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { handleAuthRedirect } from "realm-web";
import { createBrowserHistory } from "history";

import { app } from "../mongodb";
import { AuthenticationProvider } from "./AuthenticationContext";

import { LogInScene } from "./scenes/LogInScene";
import { RegisterScene } from "./scenes/RegisterScene";
import { OnboardingScene } from "./scenes/OnboardingScene";
import { ResetPasswordScene } from "./scenes/ResetPasswordScene";
import { CreateEvaluationScene } from "./scenes/CreateEvaluationScene";
import { UserProfileScene } from "./scenes/UserProfileScene";
import { EvaluationListScene } from "./scenes/EvaluationListScene";
import { EvaluationOverviewScene } from "./scenes/EvaluationOverviewScene";
import { ScoringScene } from "./scenes/ScoringScene";
import { ContentfulScene } from "./scenes/ContentfulScene";
import { JoinEvaluationScene } from "./scenes/JoinEvaluationScene";
import { ConfigurationSelector } from "../mongodb/ConfigurationSelector";
import { GreetingScene } from "./scenes/GreetingScene";

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
          <Route exact path="/" component={GreetingScene} />
          <Route path="/log-in" component={LogInScene} />
          <Route path="/register" component={RegisterScene} />
          <Route path="/onboarding" component={OnboardingScene} />
          <Route path="/reset-password" component={ResetPasswordScene} />
          <Route path="/facebook-callback" component={OAuthCallback} />
          <Route path="/google-callback" component={OAuthCallback} />
          <Route exact path="/profile" component={UserProfileScene} />
          <Route exact path="/evaluations" component={EvaluationListScene} />
          <Route
            exact
            path="/evaluations/create"
            component={CreateEvaluationScene}
          />
          <Route
            exact
            path="/evaluations/:id"
            component={EvaluationOverviewScene}
          />
          <Route exact path="/evaluations/:id/score" component={ScoringScene} />
          <Route
            exact
            path="/evaluations/:id/score/:token"
            component={JoinEvaluationScene}
          />
          <Route path="/:slug" component={ContentfulScene} />
        </Switch>
        <ConfigurationSelector />
      </AuthenticationProvider>
    </Router>
  );
}
