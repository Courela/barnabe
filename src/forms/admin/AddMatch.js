import React, { Component } from 'react';
import { Alert, Button, ControlLabel, Form, FormGroup } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { SeasonSelect, StepSelect, TeamSelect, Select } from '../../components/Controls';
import { FieldGroup } from '../../components/Controls';
import { getSeasons, getSteps, addMatch, getTeams, getPhases } from '../../utils/communications';
import handleError from '../../components/Errors';

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
            date: null,
            phase: '',
            group: '',
            matchday: '',
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

    onChangeDate = date => 
    {
        this.setState({ date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12) });
    }

    validateStep() {
        if (!this.state.stepId || this.state.stepId <= 0) return 'error';
        return null;
    }

    validatePhase() {
        if (!this.state.phase || this.state.phase <= 0) return 'error';
        return null;
    }

    validateTeam(stateProp) {
        if (!this.state[stateProp] || this.state[stateProp] <= 0) return 'error';
        return null;
    }

    handleSubmit(evt) {
        const { season, stepId, date, phase, group, matchday, homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = this.state;
        if (season && stepId && date && phase && homeTeamId && awayTeamId) {
            addMatch(season, stepId, date, phase, group, matchday, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals)
                .then(response => {
                    if (response) {
                        this.setState({ isSuccess: true, isError: false });
                    } else {
                        this.setState({ isSuccess: false, isError: true });
                    }
                })
                .catch(err => {
                    let step = this.state.steps.find(s => s.id == stepId);
                    let team = this.state.teams.find(t => t.id == (err.response.data && err.response.data.ids ? err.response.data.ids[2] : 0));
                    handleError(err, null, [ season, (step ? step.description : null), (team ? team.short_description : null) ]);
                    this.setState({  isSuccess: false, isError: true });
                });
        } else {
            console.warn('Fields: ', season, stepId, date, phase, group, matchday, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals);
            alert('Campos obrigatórios em falta!');
        }

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
                        <strong>Ocorreu um erro ao adicionar o jogo.</strong>
                    </Alert> : ''}
                <Form>
                    <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleControlChange} />
                    <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleControlChange} validationState={this.validateStep()}/>
                    <FormGroup controlId="formDate">
                        <ControlLabel>Data</ControlLabel>
                        <div>
                            <DatePicker onChange={this.onChangeDate} value={this.state.date}
                                required={true} locale="pt-PT"
                                minDate={new Date('2023-09-22T00:00:00.000Z')}
                                maxDate={new Date()}
                                calendarClassName="date-picker-form-control" />
                        </div>
                    </FormGroup>
                    <Select controlId="selectPhase" name="phase" label="Fase" 
                        options={selectPhases} value={this.state.phase} 
                        onChange={this.handleControlChange} validationState={this.validatePhase()} />
                    {this.state.phase == 1 ?
                        <FieldGroup
                            id="formGroup"
                            type="text"
                            name="group"
                            label="Grupo"
                            placeholder="Grupo"
                            onChange={this.handleControlChange}
                            style={{ width: 200 }}
                        /> : "" }
                    <FieldGroup
                        id="formMatchday"
                        type="text"
                        name="matchday"
                        label="Jornada"
                        placeholder="Jornada"
                        onChange={this.handleControlChange}
                        maxLength="2"
                        style={{ width: 40 }}
                    />
                    <div style={{display: 'flex'}}>
                        <TeamSelect controlId="selectHomeTeam" name="homeTeamId" label="Equipa Visitada"
                            teams={this.state.teams} value={homeTeamId} 
                            onChange={this.handleControlChange} validationState={this.validateTeam('homeTeamId')} />
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
                            onChange={this.handleControlChange} validationState={this.validateTeam('awayTeamId')} />
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