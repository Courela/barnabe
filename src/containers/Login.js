import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from 'axios';
import settings from '../settings';
import "../styles/Login.css";

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

        try {
            const user = await validateUser(this.state.username, this.state.password);
            console.log('Logged User: ' + user);
            if (user) {
                console.log('Login sucess!');
                const redirectTo = this.props.location.search ? this.props.location.search.match('(?<=redirect=)/.+') : null;
                //console.log(redirectTo);
                this.props.userHasAuthenticated(true, user, redirectTo);
            }
            else {
                console.log('Login failed!'); 
                this.props.userHasAuthenticated(false, user, '') 
            }
        }
        catch (e) {
            alert(e.message);
        }
    }

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="username" bsSize="large">
                        <ControlLabel>Username</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
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
                        type="submit"
                    >
                        Login
          </Button>
                </form>
            </div>
        );
    }
}

async function validateUser(username, password) {
    const promise = axios.post(
        settings.API_URL + '/api/authenticate', 
        { username: username, password: password },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return await promise.then(response => {
        console.log(response);
        return response.data;
    })
    .catch(err => {
        console.log(err);
        return null;
    });
}
