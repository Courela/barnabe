import React, { Component } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { StepSelect, TeamSelect } from '../../components/Controls';
import errors from '../../components/Errors';
import { signSteps, removeTeamStep, createTeamStep, getActiveSeason, getTeams, getTeamSteps } from '../../utils/communications';

export default class StepForm extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleTeamSelect = this.handleTeamSelect.bind(this);
        this.handleTeamSelectRemove = this.handleTeamSelectRemove.bind(this);
        this.handleStepSelect = this.handleStepSelect.bind(this);
        this.validate = this.validate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            season: 0,
            teams: [],
            steps: [],
            teamId: 0,
            stepId: 0
        };
    }

    async componentDidMount() {
        var { season, teams } = this.state;
        if (season === 0) {
            season = await getActiveSeason().then(season => season.year); 
        }
        if (teams.length === 0) {
            teams = await getTeams();
        }

        this.setState({ season: season, teams: teams });
    }

    handleTeamSelect(evt) {
        var teamId = parseInt(evt.target.value, 10);
        signSteps(this.state.season, teamId)
            .then(steps => this.setState({ steps: steps, teamId: teamId, stepId: 0 }))
            .catch(errors.handleError);
    }

    handleTeamSelectRemove(evt) {
        var teamId = parseInt(evt.target.value, 10);
        getTeamSteps(this.state.season, teamId)
            .then(steps => this.setState({ steps: steps, teamId: teamId, stepId: 0 }))
            .catch(errors.handleError);
    }

    handleStepSelect(evt) {
        this.setState({ stepId: parseInt(evt.target.value, 10) });
    }

    validate(field) {
        if (this.state[field] <= 0) return 'error';
        return null;
    }

    handleSubmit(evt) {
        var action = evt.target.name;
        const { season, teamId, stepId } = this.state; 
        if (stepId > 0) {
            var step = this.state.steps.find(s => s.id === stepId);
            if (action === 'remove') {
                if (window.confirm('Tem a certeza que quer remover o escalão ' + (step ? step.description : stepId) + '?')) {
                    removeTeamStep(season, teamId, stepId)
                        .then(() => { 
                            alert('Escalão removido.');
                            this.setState({ steps: [], teamId: 0, stepId: 0 });
                        })
                        .catch(errors.handleError);
                }
            }
            else {                
                if (window.confirm('Tem a certeza que quer adicionar o escalão ' + (step ? step.description : stepId) + '?')) {
                    createTeamStep(season, teamId, stepId)
                        .then(() => { 
                            alert('Escalão adicionado.'); 
                            this.setState({ steps: [], teamId: 0, stepId: 0 });
                        })
                        .catch(errors.handleError);
                }
            }
        }
        evt.preventDefault();
    }

    render() {
        return (
            <div>
                <h1>Gerir Escalões - {this.state.season}</h1>
                <Tabs id="manage-steps" onSelect={() => this.setState({ steps: [], teamId: 0, stepId: 0 }) }>
                    <Tab eventKey={1} title="Adicionar">
                        <StepFormOptions action="add" bsStyle="success" label="Adicionar"
                            teams={this.state.teams} teamValue={this.state.teamId} 
                            steps={this.state.steps} stepValue={this.state.stepId} 
                            teamsOnChange={this.handleTeamSelect} teamsValidationState={this.validate('teamId')}
                            stepsOnChange={this.handleStepSelect} stepsValidationState={this.validate('stepId')}
                            onSubmit={this.handleSubmit}
                        />
                    </Tab>
                    <Tab eventKey={2} title="Remover">
                        <StepFormOptions action="remove" bsStyle="danger" label="Remover"
                            teams={this.state.teams} teamValue={this.state.teamId} 
                            steps={this.state.steps} stepValue={this.state.stepId} 
                            teamsOnChange={this.handleTeamSelectRemove} teamsValidationState={this.validate('teamId')}
                            stepsOnChange={this.handleStepSelect} stepsValidationState={this.validate('stepId')}
                            onSubmit={this.handleSubmit}
                        />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

function StepFormOptions(props) {
    return (
        <div>
            <TeamSelect teams={props.teams} value={props.teamValue} 
                onChange={props.teamsOnChange} validationState={props.teamsValidationState} />
            <StepSelect steps={props.steps} value={props.stepValue}
                onChange={props.stepsOnChange} validationState={props.stepsValidationState} />
            <Button name={props.action} bsStyle={props.bsStyle} onClick={props.onSubmit}>{props.label}</Button>
        </div>);
}
