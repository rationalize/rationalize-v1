import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { app } from "../RealmApp";
import { LogInScene } from "./LogInScene";
import { MainScene } from "./MainScene/MainScene";

function isAuthenticated() {
  // console.log("Checking if theres an authenticated user", app.currentUser);
  return app.currentUser && app.currentUser.state === "active";
}

export function App() {
  return (
    <Router key={app.currentUser?.id}>
      <Switch>
        <Route path="/log-in" component={LogInScene} />
        <Route path="/events/:id/evaluate">
          {/* Skip redirect to /log-in when evaluating */}
          <MainScene />
        </Route>
        <Route>
          {isAuthenticated() ? <MainScene /> : <Redirect to={"/log-in"} />}
        </Route>
      </Switch>
    </Router>
  );
}
