import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Season from "./containers/Season";
import AppliedRoute from "./components/AppliedRoute";
import Documents from "./containers/Documents";
import Standings from "./containers/Standings";

export default ({ childProps }) => {
    let routes = [];
    routes = [
        <AppliedRoute key={2 + childProps.year} path="/admin" component={Season} props={childProps} />,
        <AppliedRoute key={3 + childProps.year} path="/seasons/:year/steps*" component={Season} props={childProps} />,
        <AppliedRoute key={4 + childProps.year} path="/seasons/:year" component={Season} props={childProps} />,
        <AppliedRoute key={5 + childProps.year} path="/login" exact component={Login} props={childProps} />,
        <AppliedRoute key={6 + childProps.year} path="/documents" exact component={Documents} props={childProps} />,
        <AppliedRoute key={7 + childProps.year} path="/standings" exact component={Standings} props={childProps} />,
        <AppliedRoute key={8 + childProps.year} path="/" exact component={Home} props={childProps} />,
        <Route key="99" component={NotFound} />,
    ];

    if (!childProps.isAuthenticated) {
        routes = [
            <Route key={0 + childProps.year} path="/seasons/:year/*steps/:stepId?*" render={(props) => <Redirect push to={'/login?redirect=' + props.match.url} />} />,
            <Route key={1 + childProps.year} path="/admin" render={(props) => <Redirect push to={'/login?redirect=' + props.match.url} />} />
        ].concat(routes);
    }

    return (
        <Switch>
            {routes}
        </Switch>);
}
