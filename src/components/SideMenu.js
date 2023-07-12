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
            teams: [],
            steps: [],
            updated: false
        }

        this.handleSelect = this.handleSelect.bind(this);
        this.getTeams = this.getTeams.bind(this);
        this.getTeamSteps = this.getTeamSteps.bind(this);
    }
    
    static getDerivedStateFromProps(props, state) {
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
        const { teamId, isAuthenticated } = this.props;
        if (isAuthenticated) {
            if (teamId && parseInt(teamId, 10) > 0) {
                this.getTeamSteps();
            } else if (this.teams && this.teams.length === 0) {
                this.getTeams();
            }
        }
    }

    getTeams() {
        const { season } = this.props;
        if (season) {
            getTeams(season)
                .then(teams => {
                    if (teams && teams.length > 0) {
                        this.setState({ teams: teams, updated: true });
                    }
                })
                .catch(errors.handleError);
        }
    }

    handleSelect(evt) {
        var stepId = evt.item.props.stepId;
        var stepName = evt.item.props.stepName;
        this.props.onStepChange(stepId, stepName);
        if (evt.key) {
            this.props.history.push(evt.key);
        }
    }

    onOpenChange(value) {
    }

    getTeamSteps() {
        const { season, teamId } = this.props;
        getTeamSteps(season, teamId)
            .then(steps => {
                this.setState({ steps: steps.map(s => Object.assign(s, { id: s.stepId })), updated: true });
            })
            .catch(errors.handleError);
    }

    render() {
        const { season, teamId } = this.props;

        const anonymousMenu = (
            <AnonymousMenu handleSelect={this.handleSelect} onOpenChange={this.onOpenChange} 
                teams={this.state.teams} season={season} />
            );

        const authenticatedMenu = (
            <AuthenticatedMenu handleSelect={this.handleSelect} onOpenChange={this.onOpenChange} 
                steps={this.state.steps} season={season} isSeasonActive={this.state.isSeasonActive}/> 
            );

        const menu = this.props.isAuthenticated ?
            (teamId > 0 ? authenticatedMenu : <AdminMenu handleSelect={this.handleSelect} />) :
            anonymousMenu;

        return (
            <div style={{ width: 150 }}>
                {menu}
            </div>);
    }
}
