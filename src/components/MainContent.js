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
import Users from '../containers/admin/Users';
import Listing from '../containers/admin/Listing';
import AddPlayer from '../forms/admin/AddPlayer';
import Db from '../containers/admin/Db'
import AddMatch from '../forms/admin/AddMatch';
import Matches from '../forms/Matches';
import Teams from '../containers/admin/Teams';
import AddTeam from '../forms/admin/AddTeam';

export default class MainContent extends Component {
    render() {
        const authenticatedRoutesArr = [{
            path: '/seasons/:year/steps/:stepId/import',
            exact: true,
            render: (props) => {
                return (<ImportPlayers {...props} teamId={this.props.teamId} />);
            }
        }, {
            path: '/seasons/:year/steps/:stepId',
            exact: true,
            render: (props) => <StepTeam {...props} teamId={this.props.teamId} 
                            isSeasonActive={this.props.isSeasonActive} isSignUpExpired={this.props.isSignUpExpired} />
        }, {
            path: '/seasons/:year/steps/:stepId/players/:playerId',
            exact: true,
            render: (props) => <PlayerDetails {...props} teamId={this.props.teamId} eighteenDate={this.props.eighteenDate}
                                    isSeasonActive={this.props.isSeasonActive} isSignUpExpired={this.props.isSignUpExpired}/>
        }, {
            path: '/seasons/:year/steps/:stepId/player',
            exact: true,
            render: (props) => { return <PlayerForm {...props} teamId={this.props.teamId} 
                                            eighteenDate={this.props.eighteenDate} roleId={1} /> }
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
            render: (props) => <SeasonMain {...props} teamId={this.props.teamId} 
                                    isSeasonActive={this.props.isSeasonActive} isSignUpExpired={this.props.isSignUpExpired}/>
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
                path: '/admin/db',
                exact: true,
                render: (props) => { return (<Db {...props} />) }
            },{
                path: '/admin/users',
                exact: true,
                render: (props) => { return (<Users {...props} />) }
            },{
                path: '/admin/users/add',
                exact: true,
                render: (props) => { return (<AddUser {...props} />) }
            },{
                path: '/admin/teams',
                exact: true,
                render: (props) => { return (<Teams {...props} />) }
            },{
                path: '/admin/teams/add',
                exact: true,
                render: (props) => { return (<AddTeam {...props} />) }
            },{
                path: '/admin/players/add',
                exact: true,
                render: (props) => { return (<AddPlayer {...props} />) }
            },{
                path: '/admin/players/search',
                exact: true,
                component: Search
            },{
                path: '/admin/steps/manage',
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
                path: '/admin/teamsteps/listing',
                exact: true,
                component: Listing
            },{
                path: '/admin/templates/match-sheet',
                exact: true,
                component: MatchSheet
            },{
                path: '/admin/templates/team-sheet',
                exact: true,
                component: TeamSheet
            },{
                path: '/admin/seasons/:year/teams/:teamId/steps/:stepId/players/:playerId',
                exact: true,
                render: (props) => <PlayerDetails {...props} isSeasonActive={false} 
                                    teamId={props.match.params.teamId} />,
            },{
                path: '/admin/matches/add',
                exact: true,
                component: AddMatch
            },{
                path: '/admin/matches/list',
                exact: true,
                render: (props) => <Matches {...props} isAdmin={true} />,
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
                    return (<Route exact={exact} path={path} render={render} key={key} />);
                } else {
                    return (<Route exact={exact} path={path} component={component} key={key} />);
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
