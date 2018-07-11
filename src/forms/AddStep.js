import React, { Component } from 'react';
import {
    FormGroup, FormControl, ControlLabel,
    Button
} from 'react-bootstrap';
import axios from 'axios';
import settings from '../settings';
import errors from '../components/Errors';

export default class AddStep extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleStepSelect = this.handleStepSelect.bind(this);
        this.validateStep = this.validateStep.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            steps: [],
            stepId: 0
        };
    }

    componentDidMount() {
        const year = this.props.match.params.year;
        const teamId = this.props.teamId;

        const url = settings.API_URL + '/api/seasons/' + year + '/teams/' + teamId + '/signsteps';
        axios.get(url)
            .then(results => {
                this.setState({ steps: results.data.map(s => ({ id: s.Id, descr: s.Description })) });
            })
            .catch(errors.handleError);
    }

    handleStepSelect(evt) {
        this.setState({ stepId: evt.target.value });
    }

    validateStep() {
        if (this.state.stepId <= 0) return 'error';
        return null;
    }

    handleSubmit(evt) {
        // console.log('Params: ' + JSON.stringify(this.props.match.params));
        // console.log('Props: ' + JSON.stringify(this.props));

        const year = this.props.match.params.year;
        const teamId = this.props.teamId;

        const url = settings.API_URL + '/api/seasons/' + year + '/teams/' + teamId + '/steps';
        const data = { stepId: this.state.stepId };
        axios.put(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => { this.props.history.push('/seasons/' + year); })
        .catch(errors.handleError);
        evt.preventDefault();
    }

    // getValidationState() {
    //     const length = this.state.value.length;
    //     if (length > 10) return 'success';
    //     else if (length > 5) return 'warning';
    //     else if (length > 0) return 'error';
    //     return null;
    // }

    render() {
        const selectSteps = this.state.steps.map((s) => <option key={s.id} value={s.id}>{s.descr}</option>);

        //const steps = ['I Escalão', 'II Escalão', 'III Escalão', 'Escolinhas', 'Feminino'];
        //const selectSteps = steps.map((step, idx) => <option key={idx} value={idx+1}>{step}</option>);
        //const dropdownSteps = steps.map((step, idx) => <MenuItem key={idx} eventKey={step} onSelect={this.handleStepSelect}>{step}</MenuItem>);

        // const dropdownControl = <ButtonToolbar>
        //     <DropdownButton bsStyle="default" bsSize="large" title={this.state.stepId}
        //         key={1} id={`split-button-basic-${1}`}>
        //         {dropdownSteps}
        //     </DropdownButton>
        // </ButtonToolbar>

        return (
            <div>
                <form>
                    <FormGroup controlId="selectStep" validationState={this.validateStep()}>
                        <ControlLabel>Escalão</ControlLabel>
                        <FormControl componentClass="select" placeholder="select" style={{ width: 200}} 
                            onChange={this.handleStepSelect}>
                            <option value="0">Escolha...</option>
                            {selectSteps}
                        </FormControl>
                        <FormControl.Feedback />
                    </FormGroup>
                    <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
                </form>
            </div>
        );
    }
}
