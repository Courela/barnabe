import React, { Component } from 'react';
import {
    FormGroup, FormControl, ControlLabel, HelpBlock,
    Button
} from 'react-bootstrap';

export default class PlayerForm extends Component {
    constructor(props, context) {
        super(props, context);

        //this.handleStepSelect = this.handleStepSelect.bind(this);
        this.validateStep = this.validateStep.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            name: '',
            stepId: props.match.params.stepId,
            birth: null,
            docId: '',
            phoneNr: '',
            email: '',
            voterNr: ''
        };
    }

    handleStepSelect(evt) {
        this.setState({ stepId: evt.target.value });
    }

    validateStep() {
        if (this.state.stepId <= 0) return 'error';
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
        const selectSteps = steps.map((step, idx) => <option key={idx} value={idx + 1}>{step}</option>);
        
        return (
            <div>
                <div style={{ width: '80%', float: 'right' }}>
                    <form>
                        <FormGroup controlId="selectStep" validationState={this.validateStep()}>
                            <ControlLabel>Escalão</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                                onChange={this.handleStepSelect} value={this.state.stepId}>
                                <option value="0">Escolha...</option>
                                {selectSteps}
                            </FormControl>
                            <FormControl.Feedback />
                        </FormGroup>
                        <FieldGroup
                            id="formName"
                            type="text"
                            label="Nome"
                            placeholder="Nome"
                        />
                        <FieldGroup
                            id="formEmail"
                            type="email"
                            label="Email"
                            placeholder="Email"
                        />
                        <FieldGroup
                            id="formPhone"
                            type="text"
                            label="Telefone"
                            placeholder="Telefone"
                        />
                        <FieldGroup
                            id="formIdCard"
                            type="text"
                            label="Nr Cartão Cidadão"
                            placeholder="CC"
                        />
                        <FieldGroup
                            id="formVoterNr"
                            type="text"
                            label="Nr de Eleitor"
                            placeholder="Eleitor"
                        />
                        <FieldGroup
                            id="formIdCard"
                            type="file"
                            label="Cópia Cartão Cidadão"
                            help="Digitalização do Cartão de Cidadão, frente e verso"
                        />
                        <FieldGroup
                            id="formFoto"
                            type="file"
                            label="Fotografia"
                            help="Digitalização de Fotografia"
                        />
                        <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
                    </form>
                </div>
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