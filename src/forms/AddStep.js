import React, { Component } from 'react';
import {
    FormGroup, FormControl, ControlLabel, HelpBlock,
    ButtonToolbar, DropdownButton, MenuItem, Button
} from 'react-bootstrap';

export default class AddStep extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleStepSelect = this.handleStepSelect.bind(this);
        this.validateStep = this.validateStep.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            step: 0
        };
    }

    handleStepSelect(evt) {
        this.setState({ step: evt.target.value });
    }

    validateStep() {
        if (this.state.step <= 0) return 'error';
        return null;
    }

    handleSubmit(evt) {
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
        const steps = ['Escolinhas', 'I Escalão', 'II Escalão', 'III Escalão', 'Feminino'];
        const selectSteps = steps.map((step, idx) => <option key={idx} value={idx+1}>{step}</option>);
        const dropdownSteps = steps.map((step, idx) => <MenuItem key={idx} eventKey={step} onSelect={this.handleStepSelect}>{step}</MenuItem>);

        const dropdownControl = <ButtonToolbar>
            <DropdownButton bsStyle="default" bsSize="large" title={this.state.step}
                key={1} id={`split-button-basic-${1}`}>
                {dropdownSteps}
            </DropdownButton>
        </ButtonToolbar>

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

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}