/* eslint no-console:0 */

import React, { Component } from 'react';
import 'rc-menu/assets/index.css';
import errors from './Errors';
import { getTeams, getTeamSteps } from '../utils/communications';
import AnonymousMenu from './AnonymousMenu';
import AuthenticatedMenu from './AuthenticatedMenu';
import AdminMenu from './AdminMenu';

export default class SideMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            season: props.season,
            teamId: props.teamId,
            teams: [],
            steps: [],
            updated: false
        }

        this.handleSelect = this.handleSelect.bind(this);
        this.getTeams = this.getTeams.bind(this);
        this.getTeamSteps = this.getTeamSteps.bind(this);
    }
    
    static getDerivedStateFromProps(props, state) {
       //console.log("Derived state from props: ", props, state);
       var year = 0;
       try {
           year = parseInt(props.match.params.year, 10);
       } catch {}
        var result = null;
        if (year && year !== state.year) {
            return { year: year };
        }

        return result;
    }

    componentDidMount() {
        // console.log("Mount completed");
        // console.log("Season: ", this.state.season);
        if (this.props.isAuthenticated) {
            if (this.state.teamId && parseInt(this.state.teamId, 10) > 0) {
                this.getTeamSteps();
            } else if (this.teams && this.teams.length === 0) {
                this.getTeams();
            }
        }
    }

    getTeams() {
        if (this.state.season) {
            getTeams(this.state.season)
                .then(teams => {
                    if (teams && teams.length > 0) {
                        this.setState({ teams: teams, updated: true });
                    }
                })
                .catch(errors.handleError);
        }
    }

    handleSelect(info) {
        if (info.key) {
            this.props.history.push(info.key);
        }
    }

    onOpenChange(value) {
    }

    getTeamSteps() {
        getTeamSteps(this.state.season, this.state.teamId)
            .then(steps => {
                this.setState({ steps: steps, updated: true });
            })
            .catch(errors.handleError);
    }

    render() {
        const anonymousMenu = (
            <AnonymousMenu handleSelect={this.handleSelect} onOpenChange={this.onOpenChange} 
                teams={this.state.teams} season={this.state.season} />
            );

        const authenticatedMenu = (
            <AuthenticatedMenu handleSelect={this.handleSelect} onOpenChange={this.onOpenChange} 
                steps={this.state.steps} season={this.state.season} isSeasonActive={this.state.isSeasonActive}/> 
            );

        const menu = this.props.isAuthenticated ?
            (this.props.teamId > 0 ? authenticatedMenu : <AdminMenu handleSelect={this.handleSelect} />) :
            anonymousMenu;

        return (
            <div style={{ width: 150 }}>
                {menu}
            </div>);
    }
}
