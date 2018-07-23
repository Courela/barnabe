import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SeasonMain from '../containers/SeasonMain';
import Team from '../containers/Team';
import Player from '../containers/Player';
import NotFound from '../containers/NotFound';
import Results from '../containers/Results';
import Standings from '../containers/Standings';
import StepTeam from '../containers/StepTeam';
import Documents from '../containers/Documents';
import PlayerForm from '../forms/PlayerFom';
import StepForm from '../forms/StepForm';
import GoogleApiForm from '../forms/GoogleApiForm';
import AddUser from '../forms/AddUser';
//import ImportPlayers from '../forms/ImportPlayers';
import ImportPlayers from '../forms/Import';
import PlayerDetails from '../forms/PlayerDetails';

export default class MainContent extends Component {
    render() {
        //console.log('MainContent props: ' + JSON.stringify(this.props));
        let stepId = 0;

        const authenticatedRoutesArr = [{
            path: '/seasons/:year/remove-step',
            exact: true,
            //component: AddStep,
            render: (props) => { return (<StepForm {...props} teamId={this.props.teamId} />) }
        },{
            path: '/seasons/:year/add-step',
            exact: true,
            //component: AddStep,
            render: (props) => { return (<StepForm {...props} teamId={this.props.teamId} />) }
        }, {
            path: '/seasons/:year/steps/:stepId/import',
            exact: true,
            render: (props) => {
                return (<ImportPlayers {...props} teamId={this.props.teamId} />);
            }
        }, {
            path: '/seasons/:year/steps/:stepId',
            exact: true,
            render: (props) => {
                return (<StepTeam {...props} teamId={this.props.teamId} />);
            }
        }, {
            path: '/seasons/:year/steps/:stepId/players/:playerId',
            exact: true,
            render: (props) => <PlayerDetails {...props} teamId={this.props.teamId} />,
        }, {
            path: '/seasons/:year/steps/:stepId/player',
            exact: true,
            render: (props) => { return <PlayerForm {...props} teamId={this.props.teamId} roleId="1" /> }
        }, {
            path: '/seasons/:year/steps/:stepId/staff',
            exact: true,
            render: (props) => { return <PlayerForm {...props} teamId={this.props.teamId} /> }
        }, {
            path: "/seasons/:year/documents",
            component: Documents
        }, {
            path: '/seasons/:year',
            exact: true,
            render: (props) => <SeasonMain {...props} teamId={this.props.teamId} />
        }];

        if (this.props.isAuthenticated && !this.props.teamId) {
            authenticatedRoutesArr.push({
                path: '/admin/drive',
                exact: true,
                //component: AddStep,
                render: (props) => { return (<GoogleApiForm {...props} />) }
            },{
                path: '/admin/users',
                exact: true,
                //component: AddStep,
                render: (props) => { return (<AddUser {...props} />) }
            });
        }

        authenticatedRoutesArr.push({
            path: '/',
            exact: false,
            render: (props) => { return (<NotFound {...props} />) }
        });

        const authenticatedRoutes = authenticatedRoutesArr.map(
            ({ path, exact, component, render }, key) => {
                if (render) {
                    return (<Route exact={exact} path={path} render={render} key={key + stepId} />);
                } else {
                    return (<Route exact={exact} path={path} component={component} key={key + stepId} />);
                }
            });

        const anonymousRoutes = [
            <Route key="1" path="/seasons/:year/results" exact component={Results} />,
            <Route key="2" path="/seasons/:year/standings" exact component={Standings} />,
            <Route key="3" path="/seasons/:year/teams/:teamId" exact component={Team} />,
            <Route key="4" path="/seasons/:year/players/:playerId" exact component={Player} />,
            <Route key="5" path="/seasons/:year" exact render={(props) => <div>Edição {props.match.params.year}</div>} />,
            //<Route key="6" path="/seasons/:year/teams/:teamId/*steps/:stepId?" render={(props) => <Redirect push to={'/login?redirect=' + props.match.url} />} />,
            <Route key="99" component={NotFound} />
        ];

        return (
            <Switch>
                {this.props.isAuthenticated ? authenticatedRoutes : anonymousRoutes}
            </Switch>);
    }
}
