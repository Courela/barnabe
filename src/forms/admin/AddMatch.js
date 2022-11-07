import React, { Component } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { SeasonSelect, StepSelect, TeamSelect, Select } from '../../components/Controls';
import { FieldGroup } from '../../utils/controls';
import { getSeasons, getSteps, addMatch, getTeams, getPhases } from '../../utils/communications';
import { handleError } from '../../components/Errors';

export default class AddMatch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSuccess: false,
            isError: false,
            seasons: [],
            teams: [],
            steps: [],
            phases: [],
            season: 0,
            stepId: 0,
            phase: '',
            homeTeamId: 0,
            homeTeamGoals: 0,
            awayTeamId: 0,
            awayTeamGoals: 0,
        };

        this.handleControlChange = this.handleControlChange.bind(this);
        this.getFilters = this.getFilters.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        await this.getFilters();
    }

    async getFilters() {
        var seasons = await getSeasons();
        var activeSeason = seasons.find(s => s.is_active);
        var teams = await getTeams();
        var steps = await getSteps();
        var phases = await getPhases();
        this.setState({ seasons: seasons, teams: teams, steps: steps, phases: phases, season: activeSeason.year });
    }

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmit(evt) {
        const { season, stepId, phase, homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = this.state;
        addMatch(season, stepId, phase, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals)
            .then(response => {
                if (response) {
                    this.setState({ isSuccess: true });
                    this.setState({ isError: false });
                } else {
                    this.setState({ isSuccess: false });
                    this.setState({ isError: true });
                }
            })
            .catch(err => {
                handleError(err);
                this.setState({ isError: true });
            });
        if (evt) { evt.preventDefault(); }
    }

    render() {
        const { season, homeTeamId, awayTeamId, stepId } = this.state;
        const selectPhases = this.state.phases.map(s => { return { value: s.id, description: s.description }; });

        return (
            <div>
                {this.state.isSuccess ?
                    <Alert bsStyle="success">
                        <strong>Jogo adicionado com sucesso.</strong>
                    </Alert> : this.state.isError ?
                    <Alert bsStyle="danger">
                        <strong>Ocurreu um erro ao adicionar o jogo.</strong>
                    </Alert> : ''}
                <Form>
                    <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleControlChange} />
                    <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleControlChange} />
                    <Select controlId="selectPhase" name="phase" label="Fase" 
                        options={selectPhases} value={this.state.phase} 
                        onChange={this.handleControlChange} /* validationState={props.validationState} */ />
                    <div style={{display: 'flex'}}>
                        <TeamSelect controlId="selectHomeTeam" name="homeTeamId" label="Equipa Visitada"
                            teams={this.state.teams} value={homeTeamId} 
                            onChange={this.handleControlChange} />
                        <div style={{width:"45px"}}>
                            <FieldGroup
                                id="homeTeamGoals"
                                type="text"
                                name="homeTeamGoals"
                                label="Golos"
                                placeholder="Golos"
                                value={this.state.homeTeamGoals}
                                onChange={this.handleControlChange}
                                maxLength="2"
                                // validationState={validateNotEmpty}
                                // validationArgs={""}
                                />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <TeamSelect controlId="selectAwayTeam" name="awayTeamId" label="Equipa Visitante"
                            teams={this.state.teams} value={awayTeamId} 
                            onChange={this.handleControlChange} />
                        <div style={{width:"45px"}}>
                            <FieldGroup
                                id="awayTeamGoals"
                                type="text"
                                name="awayTeamGoals"
                                label="Golos"
                                placeholder="Golos"
                                value={this.state.awayTeamGoals}
                                onChange={this.handleControlChange}
                                maxLength="2"
                                // validationState={validateNotEmpty}
                                // validationArgs={""}
                                />
                        </div>
                    </div>
                    <Button bsStyle="primary" type="submit" 
                        onClick={this.handleSubmit} 
                        disabled={this.state.loading}>
                            Adicionar
                    </Button>
                </Form>
            </div>
        );
    }
}