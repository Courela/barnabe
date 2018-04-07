import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Torneio from "./containers/Torneio";
import Season from "./containers/Season";
import Team from "./containers/Team";
import Player from "./containers/Player";

import AppliedRoute from "./components/AppliedRoute";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/season/:year/player/:playerId" exact component={Player} />
    <AppliedRoute path="/season/:year/team/:teamId" exact component={Team} />
    <AppliedRoute path="/season/:year/results" exact component={Home} />
    <AppliedRoute path="/season/:year/standings" exact component={Home} />
    <AppliedRoute path="/season/:year" exact component={Season} props={childProps} />
    
    <AppliedRoute path="/torneio" exact component={Torneio} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/" exact component={Home} props={childProps} />

    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;