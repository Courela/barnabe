import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SeasonMain from '../containers/SeasonMain';
import Player from '../containers/Player';
import NotFound from '../containers/NotFound';
import StepTeam from '../containers/StepTeam';
import Documents from '../containers/Documents';
import PlayerForm from '../forms/PlayerForm';
import StepForm from '../forms/admin/StepForm';
import GoogleApiForm from '../forms/admin/GoogleApiForm';
import AddUser from '../forms/admin/AddUser';
import ImportPlayers from '../forms/Import';
import PlayerDetails from '../forms/PlayerDetails';
import ManageSeasons from '../forms/admin/ManageSeasons';
import Search from '../containers/admin/Search';
import Statistics from '../containers/admin/Statistics';
import ManagePersons from '../containers/admin/ManagePersons';
import MatchSheet from '../containers/admin/MatchSheet';
import TeamSheet from '../containers/admin/TeamSheet';

export default class MainContent extends Component {
    render() {
        //console.log('MainContent props: ' + JSON.stringify(this.props));
        let stepId = 0;

        const authenticatedRoutesArr = [{
            path: '/seasons/:year/steps/:stepId/import',
            exact: true,
            render: (props) => {
                return (<ImportPlayers {...props} teamId={this.props.teamId} />);
            }
        }, {
            path: '/seasons/:year/steps/:stepId',
            exact: true,
            render: (props) => {
                return (<StepTeam {...props} isSeasonActive={this.props.isSeasonActive} teamId={this.props.teamId} />);
            }
        }, {
            path: '/seasons/:year/steps/:stepId/players/:playerId',
            exact: true,
            render: (props) => <PlayerDetails {...props} isSeasonActive={this.props.isSeasonActive} 
                                    teamId={this.props.teamId} eighteenDate={this.props.eighteenDate}/>,
        }, {
            path: '/seasons/:year/steps/:stepId/player',
            exact: true,
            render: (props) => { return <PlayerForm {...props} teamId={this.props.teamId} 
                                            eighteenDate={this.props.eighteenDate} roleId="1" /> }
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
            render: (props) => <SeasonMain {...props} isSeasonActive={this.props.isSeasonActive} teamId={this.props.teamId} />
        }];

        if (this.props.isAuthenticated && !this.props.teamId) {
            authenticatedRoutesArr.push({
                path: '/admin',
                exact: true,
                render: (props) => { return (<Statistics {...props} />) }
            },{
                path: '/admin/drive',
                exact: true,
                render: (props) => { return (<GoogleApiForm {...props} />) }
            },{
                path: '/admin/users',
                exact: true,
                render: (props) => { return (<AddUser {...props} />) }
            },{
                path: '/admin/manage-steps',
                exact: true,
                component: StepForm
            }, 
            {
                path: '/admin/seasons',
                exact: true,
                render: (props) => { return (<ManageSeasons {...props} />) }
            },{
                path: '/admin/manage-persons',
                exact: true,
                component: ManagePersons
            },{
                path: '/admin/search',
                exact: true,
                component: Search
            },{
                path: '/admin/match-sheet',
                exact: true,
                component: MatchSheet
            },{
                path: '/admin/team-sheet',
                exact: true,
                component: TeamSheet
            },{
                path: '/admin/seasons/:year/teams/:teamId/steps/:stepId/players/:playerId',
                exact: true,
                render: (props) => <PlayerDetails {...props} isSeasonActive={false} 
                                    teamId={props.match.params.teamId} />,
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
            <Route key="1" path="/seasons/:year/players/:playerId" exact component={Player} />,
            <Route key="2" path="/seasons/:year" exact render={(props) => <div>Edição {props.match.params.year}</div>} />,
            //<Route key="6" path="/seasons/:year/teams/:teamId/*steps/:stepId?" render={(props) => <Redirect push to={'/login?redirect=' + props.match.url} />} />,
            <Route key="99" component={NotFound} />
        ];

        return (
            <Switch>
                {this.props.isAuthenticated ? authenticatedRoutes : anonymousRoutes}
            </Switch>);
    }
}
