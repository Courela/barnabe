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

        const action = props.location.pathname.includes('remove-step') ? 'remove' : 'add';

        this.state = {
            steps: [],
            stepId: 0,
            action: action
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
        // console.log('Params: ', this.props.match.params);
        // console.log('Props: ', this.props);
        if (this.state.stepId > 0) {
            const year = this.props.match.params.year;
            const teamId = this.props.teamId;

            let url = settings.API_URL + '/api/seasons/' + year + '/teams/' + teamId + '/steps';
            if (this.state.action === 'remove') {
                url = url + '/' + this.state.stepId; 
                axios.delete(url)
                    .then(res => { this.props.history.push('/seasons/' + year); })
                    .catch(errors.handleError);
            }
            else {
                const data = { stepId: this.state.stepId };
                axios.put(url, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => { this.props.history.push('/seasons/' + year); })
                    .catch(errors.handleError);
            }
        }
        evt.preventDefault();
    }

    render() {
        const selectSteps = this.state.steps.map((s) => <option key={s.id} value={s.id}>{s.descr}</option>);

        return (
            <div>
                <h1>{this.state.action === 'remove' ? 'Remover ' : 'Inscrever '}escalão</h1>
                <form>
                    <FormGroup controlId="selectStep" validationState={this.validateStep()}>
                        <ControlLabel>Escalão</ControlLabel>
                        <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
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