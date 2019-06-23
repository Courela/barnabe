import React, { Component } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { StepSelect, TeamSelect } from '../../components/Controls';
import errors from '../../components/Errors';
import { signSteps, removeTeamStep, createTeamStep, getActiveSeason, getTeams } from '../../utils/communications';

export default class StepForm extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleTeamSelect = this.handleTeamSelect.bind(this);
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
            season = await getActiveSeason().then(res => res.Year); 
        }
        if (teams.length === 0) {
            teams = await getTeams().then(res => res.data);
        }

        this.setState({ season: season, teams: teams });
    }

    handleTeamSelect(evt) {
        var teamId = parseInt(evt.target.value, 10);
        signSteps(this.state.season, teamId)
            .then(results => this.setState({ steps: results.data, teamId: teamId, stepId: 0 }))
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
        // console.log('Params: ', this.props.match.params);
        // console.log('Props: ', this.props);
        const { season, teamId, stepId } = this.state; 
        if (stepId > 0) {
            var step = this.state.steps.find(s => s.Id === stepId);
            if (action === 'remove') {
                if (window.confirm('Tem a certeza que quer remover o escalão ' + (step ? step.Description : stepId) + '?')) {
                    removeTeamStep(season, teamId, stepId)
                        .then(res => { 
                            //this.props.history.push('/seasons/' + year);
                            
                            //TODO Avoid whole page refresh
                            //window.location.href = '/seasons/' + season;
                            alert('Escalão removido.');
                        })
                        .catch(errors.handleError);
                }
            }
            else {                
                if (window.confirm('Tem a certeza que quer adicionar o escalão ' + (step ? step.Description : stepId) + '?')) {
                    createTeamStep(season, teamId, stepId)
                        .then(res => { alert('Escalão adicionado.'); })
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
                <Tabs>
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
                            teamsOnChange={this.handleTeamSelect} teamsValidationState={this.validate('teamId')}
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
