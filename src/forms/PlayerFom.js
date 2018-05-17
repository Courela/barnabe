import React, { Component } from 'react';
import {
    FormGroup, FormControl, ControlLabel, HelpBlock,
    Button
} from 'react-bootstrap';
import axios from 'axios';
import settings from '../settings';
import errors from '../components/Errors';

export default class PlayerForm extends Component {
    constructor(props, context) {
        super(props, context);

        //this.handleStepSelect = this.handleStepSelect.bind(this);
        this.validateStep = this.validateStep.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getGender = this.getGender.bind(this);

        const stepId = props.match.params.stepId;
        this.getGender(stepId);

        this.state = {
            season: props.match.params.year,
            teamId: props.teamId,
            stepId: stepId,
            personId: null,
            name: '',
            gender: null,
            birth: '',
            docId: '',
            phoneNr: '',
            email: '',
            voterNr: ''
        };
    }
    
    getGender(stepId) {
        axios.get(settings.API_URL + '/api/step/' + stepId)
            .then(res => {
                console.log('GetGender: ' + JSON.stringify(res));
                this.setState({ gender: res.data.Gender ? res.data.Gender : 'M' }); 
            })
            .catch(errors.handleError);
    }

    handleStepSelect(evt) {
        this.setState({ stepId: evt.target.value });
    }

    handleControlChange(evt) {
        //console.log(evt);
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    validateStep() {
        if (this.state.stepId <= 0) return 'error';
        return null;
    }

    handleSubmit(evt) {
        const { season, teamId, stepId, personId } = this.state;
        if (personId !== null) {
            console.log('Submitting player...');
            axios.post(settings.API_URL + '/api/season/' + season + '/team/' + teamId + '/step/' + stepId + '/player', this.state)
                .then(result => {
                    console.log(result);
                    const playerId = result.data.Id;
                    this.props.history.push('/season/' + season + '/step/'+ stepId + '/players/' + playerId);
                    // if (result.data && result.data.length > 0) {
                    //     this.setState({ data: result.data });
                    // }
                })
                .catch(errors.handleError);
        }
        else {
            console.log('Search person with docId ' + this.state.docId);
            axios.get(settings.API_URL + '/api/person?docId=' + this.state.docId)
                .then(result => {
                    const person = result.data;
                    console.log('Person result: ' + JSON.stringify(person));
                    if (person.Id) {
                        console.log('Set personId: ' + person.Id);
                        this.setState({
                            personId: person.Id,
                            name: person.Name,
                            email: person.Email ? person.Email : '',
                            phoneNr: person.Phone ? person.Phone : '',
                            birth: person.Birthdate,
                            voterNr: person.VoterNr
                        });
                        // if (result.data && result.data.length > 0) {
                        //     this.setState({ data: result.data });
                        // }
                    } else {
                        console.log('No person found');
                        this.setState({ personId: 0 });
                    }
                })
                .catch(errors.handleError);
        }
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
        const steps = ['I Escalão', 'II Escalão', 'III Escalão', 'Escolinhas', 'Feminino'];
        const selectSteps = steps.map((step, idx) => <option key={idx} value={idx + 1}>{step}</option>);

        const formDetails = this.state.personId !== null ?
            <PlayerDetails {...this.state} handleControlChange={this.handleControlChange.bind(this)} /> :
            <div />;

        const submitLabel = this.state.personId ? "Inscrever" : "Continuar"

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
                            id="formIdCard"
                            type="text"
                            name="docId"
                            label="Nr Cartão Cidadão"
                            placeholder="CC"
                            onChange={this.handleControlChange.bind(this)}
                        />
                        {formDetails}
                        <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>{submitLabel}</Button>
                    </form>
                </div>
            </div>
        );
    }
}

function PlayerDetails(props) {
    return (<div>
        <FieldGroup
            id="formName"
            type="text"
            name="name"
            label="Nome"
            placeholder="Nome"
            value={props.name}
            onChange={props.handleControlChange}
        />
        <FieldGroup
            id="formEmail"
            type="email"
            name="email"
            label="Email"
            placeholder="Email"
            value={props.email}
            onChange={props.handleControlChange}
        />
        <FieldGroup
            id="formPhone"
            type="text"
            name="phoneNr"
            label="Telefone"
            placeholder="Telefone"
            value={props.phoneNr}
            onChange={props.handleControlChange}
        />
        <FieldGroup
            id="formBirthdate"
            type="text"
            name="birth"
            label="Data Nascimento"
            placeholder="aaaa-mm-dd"
            value={props.birth}
            onChange={props.handleControlChange}
        />
        <FieldGroup
            id="formVoterNr"
            type="text"
            name="voterNr"
            label="Nr de Eleitor"
            placeholder="Eleitor"
            value={props.voterNr}
            onChange={props.handleControlChange}
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
        /></div>);
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