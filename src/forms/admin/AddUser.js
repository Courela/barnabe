import React, { Component } from 'react';
import {
    FormGroup, FormControl, ControlLabel, Button
} from 'react-bootstrap';
import { FieldGroup } from '../../utils/controls';
import errors from '../../components/Errors';
import { getTeams, createUser } from '../../utils/communications';
import { isValidEmail } from '../../utils/validations';

export default class AddUser extends Component {
    constructor(props, context) {
        super(props, context);

        this.validateTeam = this.validateTeam.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.handleTeamSelect = this.handleTeamSelect.bind(this);
        this.handleControlChange = this.handleControlChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            teams: [],
            username: '',
            password: '',
            email: '',
            teamId: 0
        }
    }

    componentDidMount() {
        getTeams()
            .then(teams => {
                this.setState({ teams: teams });
            })
            .catch(errors.handleError);
    }

    validateTeam() {
        if (this.state.teamId <= 0) return 'error';
        return null;
    }

    validateEmail() {
        if (this.state.email && !isValidEmail(this.state.email)) return 'error';
        return null;
    };

    handleTeamSelect(evt) {
        this.setState({ teamId: evt.target.value });
    }

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmit(evt) {
        if (this.state.teamId > 0) {
            const { username, password, teamId, email } = this.state;
            createUser(username, password, teamId, email)
                .then(() => {
                    alert('Utilizador criado com sucesso.');
                });
        }
        evt.preventDefault();
    }

    render() {
        const selectTeams = this.state.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>);

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
                <FieldGroup
                    id="formEmail"
                    type="text"
                    name="email"
                    label="Email"
                    placeholder="Email"
                    validationState={this.validateEmail}
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
