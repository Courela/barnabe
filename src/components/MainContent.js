import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Team from '../containers/Team';
import Player from '../containers/Player';
import NotFound from '../containers/NotFound';
import Results from '../containers/Results';
import Standings from '../containers/Standings';
import StepTeam from '../containers/StepTeam';

export default class MainContent extends Component {
    render() {
        const authenticatedRoutesArr = [{
            path: '/season/:year/team/:teamId/step/addstep',
            exact: true,
            component: StepTeam,
        }, {
            path: '/season/:year/team/:teamId/step/:stepId',
            exact: false,
            component: StepTeam,
        }];

        const authenticatedRoutes = authenticatedRoutesArr.map(({path, exact, component}, key) => <Route exact={exact} path={path} component={component} key={key} />);

        const anonymousRoutes = [
            <Route key="1" path="/season/:year/results" exact component={Results} />,
            <Route key="2" path="/season/:year/standings" exact component={Standings} />,
            <Route key="3" path="/season/:year/team/:teamId" exact component={Team} />,
            <Route key="4" path="/season/:year/player/:playerId" exact component={Player} />,
            <Route key="5" path="/season/:year" exact render={(props) => <div>Época {props.match.params.year}</div>} />,
            <Route key="6" path="/season/:year/team/:teamId/step" render={(props) => <Redirect push to="/login" />} />,
            <Route key="7" component={NotFound} />
        ];

        return (
            <div>
                <Switch>
                    {this.props.isAuthenticated ? authenticatedRoutes : anonymousRoutes }
                </Switch>
            </div>);
    }
}
