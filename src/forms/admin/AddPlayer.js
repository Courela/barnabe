import React, { Component } from 'react';
import {
    FormGroup, FormControl, ControlLabel /*, HelpBlock, Button */
} from 'react-bootstrap';
import errors from '../../components/Errors';
import { getTeams, /* getSteps, createUser, */ getSeasons } from '../../utils/communications';
import PlayerForm from '../PlayerForm';

export default class AddPlayer extends Component {
    constructor(props, context) {
        super(props, context);

        this.validateSeason = this.validateSeason.bind(this);
        this.validateTeam = this.validateTeam.bind(this);
        this.handleSeasonSelect = this.handleSeasonSelect.bind(this);
        this.handleTeamSelect = this.handleTeamSelect.bind(this);

        this.state = {
            seasons: [],
            teams: [],
            season: 0,
            teamId: 0
        }
    }

    componentDidMount() {
        getSeasons()
            .then(seasons => {
                this.setState({ seasons: seasons.map(s => ({ id: s.year, descr: s.year })) });
            })
        .catch(errors.handleError);
        getTeams()
            .then(teams => {
                this.setState({ teams: teams.map(s => ({ id: s.id, descr: s.name })) });
            })
            .catch(errors.handleError);
    }

    validateSeason() {
        if (this.state.season <= 0) return 'error';
        return null;
    }

    validateTeam() {
        if (this.state.teamId <= 0) return 'error';
        return null;
    }

    handleSeasonSelect(evt) {
        this.setState({ season: evt.target.value });
    }

    handleTeamSelect(evt) {
        this.setState({ teamId: evt.target.value });
    }

    render() {
        const selectSeasons = this.state.seasons.map((s) => <option key={s.id} value={s.id}>{s.descr}</option>);
        const selectTeams = this.state.teams.map((t) => <option key={t.id} value={t.id}>{t.descr}</option>);

        const { season, teamId, stepId } = this.state;
        return (
            <div>
                <FormGroup controlId="selectSeason" validationState={this.validateSeason()}>
                    <ControlLabel>Época</ControlLabel>
                    <FormControl componentClass="select" placeholder="select"
                        onChange={this.handleSeasonSelect}>
                        <option value="0">Escolha...</option>
                        {selectSeasons}
                    </FormControl>
                    <FormControl.Feedback />
                </FormGroup>
                <FormGroup controlId="selectTeam" validationState={this.validateTeam()}>
                    <ControlLabel>Equipa</ControlLabel>
                    <FormControl componentClass="select" placeholder="select"
                        onChange={this.handleTeamSelect}>
                        <option value="0">Escolha...</option>
                        {selectTeams}
                    </FormControl>
                    <FormControl.Feedback />
                </FormGroup>
                {season > 0 && teamId > 0 ?
                    <PlayerForm {...this.props} season={season} teamId={teamId} stepId={stepId} eighteenDate={this.props.eighteenDate} roleId={1} /> :
                    <div /> }
            </div>);
    }
}
