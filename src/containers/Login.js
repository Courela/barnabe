import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "../styles/Login.css";
//import errors from '../components/Errors';
import { login } from '../utils/communications';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        };
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        const user = await validateUser(this.state.username, this.state.password);
        console.log('Logged User: ' + user);
        if (user) {
            console.log('Login sucess!');
            console.log('Location search: ', this.props.location.search);
            const redirectTo = this.props.location.search ? this.props.location.search.match('(?<=redirect=)/.+')[0] : null;
            console.log('Redirect to: ', redirectTo);
            this.props.userHasAuthenticated(true, user, redirectTo);
        }
        else {
            console.log('Login failed!');
            this.props.userHasAuthenticated(false, user, '');
            alert('Autenticação falhou!');
        }
    }

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="username" bsSize="large">
                        <ControlLabel>Nome de utilizador</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Palavra-passe</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit">
                        Entrar
                    </Button>
                </form>
            </div>
        );
    }
}

async function validateUser(username, password) {
    const promise = login(username, password);
    return await promise.then(response => {
        console.log(response);
        return response.data;
    })
        .catch(() => null);
}
