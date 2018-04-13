import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Team from '../containers/Team';
import Player from '../containers/Player';
import NotFound from '../containers/NotFound';
import Results from '../containers/Results';
import Standings from '../containers/Standings';
import StepTeam from '../containers/StepTeam';
import Documents from '../containers/Documents';
import PlayerForm from '../forms/PlayerFom';
import AddStep from '../forms/AddStep';

export default class MainContent extends Component {
    render() {
        //console.log('MainContent props: ' + JSON.stringify(this.props));

        const authenticatedRoutesArr = [{
            path: '/season/:year/addstep',
            exact: true,
            component: AddStep,
        }, {
            path: '/season/:year/step/:stepId/player/:playerId',
            exact: true,
            component: Player,
        }, {
            path: '/season/:year/step/:stepId/player',
            exact: true,
            component: PlayerForm,
        }, {
            path: '/season/:year/step/:stepId',
            exact: false,
            component: StepTeam,
        }, {
            path: "/season/:year/documents",
            component: Documents
        }];

        const authenticatedRoutes = authenticatedRoutesArr.map(({path, exact, component}, key) => <Route exact={exact} path={path} component={component} key={key} />);

        const anonymousRoutes = [
            <Route key="1" path="/season/:year/results" exact component={Results} />,
            <Route key="2" path="/season/:year/standings" exact component={Standings} />,
            <Route key="3" path="/season/:year/team/:teamId" exact component={Team} />,
            <Route key="4" path="/season/:year/player/:playerId" exact component={Player} />,
            <Route key="5" path="/season/:year" exact render={(props) => <div>Época {props.match.params.year}</div>} />,
            //<Route key="6" path="/season/:year/team/:teamId/*step/:stepId?" render={(props) => <Redirect push to={'/login?redirect=' + props.match.url} />} />,
            <Route key="99" component={NotFound} />
        ];
        
        return (
            <div>
                <Switch>
                    {this.props.isAuthenticated ? authenticatedRoutes : anonymousRoutes }
                </Switch>
            </div>);
    }
}
