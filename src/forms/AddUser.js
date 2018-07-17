import React, { Component } from 'react';
import {
    FormGroup, FormControl, ControlLabel, HelpBlock, Button
} from 'react-bootstrap';
import axios from 'axios';
import settings from '../settings';
import errors from '../components/Errors';

export default class AddUser extends Component {
    constructor(props, context) {
        super(props, context);

        this.validateTeam = this.validateTeam.bind(this);
        this.handleTeamSelect = this.handleTeamSelect.bind(this);
        this.handleControlChange = this.handleControlChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            teams: [],
            username: '',
            password: '',
            teamId: 0
        }
    }

    componentDidMount() {
        const url = settings.API_URL + '/api/teams';
        axios.get(url)
            .then(results => {
                this.setState({ teams: results.data.map(s => ({ id: s.Id, descr: s.Name })) });
            })
            .catch(errors.handleError);
    }

    validateTeam() {
        if (this.state.teamId <= 0) return 'error';
        return null;
    }

    handleTeamSelect(evt) {
        this.setState({ teamId: evt.target.value });
    }

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        //console.log(fieldName, fieldVal);
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmit(evt) {
        if (this.state.teamId > 0) {
            const url = settings.API_URL + '/api/admin/users';
            const data = {
                username: this.state.username,
                password: this.state.password,
                teamId: this.state.teamId
            };
            axios.put(url, data)
                .then(result => {
                    console.log(result);
                    alert('Utilizador criado com sucesso.');
                })
                .catch((err) => {
                    errors.handleError(err, { e409: 'Nome de utilizador já existe!'});
                });
        }
        evt.preventDefault();
    }

    render() {
        const selectTeams = this.state.teams.map((t) => <option key={t.id} value={t.id}>{t.descr}</option>);

        return (
            <form>
                <FieldGroup
                    id="formUsername"
                    type="text"
                    name="username"
                    label="Nome de utilizador"
                    placeholder="Username"
                    onChange={this.handleControlChange}
                />
                <FieldGroup
                    id="formPassword"
                    type="password"
                    name="password"
                    label="Palavra-passe"
                    placeholder="Password"
                    onChange={this.handleControlChange}
                />
                <FormGroup controlId="selectTeam" validationState={this.validateTeam()}>
                    <ControlLabel>Equipa</ControlLabel>
                    <FormControl componentClass="select" placeholder="select"
                        onChange={this.handleTeamSelect}>
                        <option value="0">Escolha...</option>
                        {selectTeams}
                    </FormControl>
                    <FormControl.Feedback />
                </FormGroup>
                <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Guardar</Button>
            </form>);
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