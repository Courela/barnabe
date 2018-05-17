import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
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
            //component: AddStep,
            render: (props) => { return (<AddStep {...props} teamId={this.props.teamId} />) }
        }, {
            path: '/season/:year/step/:stepId',
            exact: true,
            render: (props) => <StepTeam {...props} teamId={this.props.teamId} />,
        }, {
            path: '/season/:year/step/:stepId/player/:playerId',
            exact: true,
            component: Player,
        }, {
            path: '/season/:year/step/:stepId/player',
            exact: true,
            render: (props) => { return <PlayerForm {...props} teamId={this.props.teamId} /> }
        }, {
            path: "/season/:year/documents",
            component: Documents
        }];

        const authenticatedRoutes = authenticatedRoutesArr.map(
            ({path, exact, component, render}, key) => { 
                if (render) {
                    return (<Route exact={exact} path={path} render={render} key={key} />);
                } else {
                    return (<Route exact={exact} path={path} component={component} key={key} />);
                }
            });

        const anonymousRoutes = [
            <Route key="1" path="/season/:year/results" exact component={Results} />,
            <Route key="2" path="/season/:year/standings" exact component={Standings} />,
            <Route key="3" path="/season/:year/team/:teamId" exact component={Team} />,
            <Route key="4" path="/season/:year/player/:playerId" exact component={Player} />,
            <Route key="5" path="/season/:year" exact render={(props) => <div>Edição {props.match.params.year}</div>} />,
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
