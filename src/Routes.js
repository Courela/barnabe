import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Torneio from "./containers/Torneio";
import Player from "./containers/Player";
import AppliedRoute from "./components/AppliedRoute";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/torneio" exact component={Torneio} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/player/:id" component={Player} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;