import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Torneio from "./containers/Torneio";
import Season from "./containers/Season";
import AppliedRoute from "./components/AppliedRoute";
import GoogleApiForm from "./forms/GoogleApiForm";

export default ({ childProps }) => {
    //console.log('Render Routes: ' + childProps.isAuthenticated + " " + JSON.stringify(childProps));

    let routes = [
        <AppliedRoute key="0" path="/season/:year/step*" component={Season} props={childProps} />,
        <AppliedRoute key="1" path="/season/:year" component={Season} props={childProps} />,
        <AppliedRoute key="2" path="/torneio" exact component={Torneio} props={childProps} />,
        <AppliedRoute key="3" path="/login" exact component={Login} props={childProps} />,
        <AppliedRoute key="4" path="/admin" exact component={GoogleApiForm} props={childProps} />,
        <AppliedRoute key="5" path="/" exact component={Home} props={childProps} />,
        <Route key="99" component={NotFound} />,
    ];

    if (!childProps.isAuthenticated) {
        routes = [
            <Route key="0" path="/season/:year/*step/:stepId?*" render={(props) => <Redirect push to={'/login?redirect=' + props.match.url} />} />,
        ].concat(routes);
    }

    return (
    <Switch>
        {routes}
    </Switch>);
}
