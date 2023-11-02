import React, { Component } from 'react';
import { Fragment } from 'react';
import { Button } from 'react-bootstrap';
import { FieldGroup } from '../components/Controls';
import { saveUserDetails } from '../utils/communications'
import handleError from '../components/Errors';

export default class UserForm extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            username: this.props.username,
            password: "",
            email: this.props.email
        }

        this.handleControlChange = this.handleControlChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
    }

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    async handleSubmit(evt) {
        try
        {
            await saveUserDetails(this.state.username, this.state.password, this.state.email);
            alert('Details guardados.');
        } catch (err) {
            handleError(err);
        }
    }

    render() {
        return (
            <Fragment>
                <form>
                    <FieldGroup
                        id="formUsername"
                        type="text"
                        name="username"
                        label="Nome de utilizador"
                        placeholder="Username"
                        value={this.state.username}
                        readOnly
                    />
                    <FieldGroup
                        id="formPassword"
                        type="password"
                        name="password"
                        label="Palavra-passe"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleControlChange}
                    />
                    <FieldGroup
                        id="formEmail"
                        type="text"
                        name="email"
                        label="Email"
                        placeholder="Email"
                        value={this.state.email }
                        onChange={this.handleControlChange}
                    />
                </form>
                <div style={{ display: 'flex', flexDirection: 'row-reverse', padding: '5px' }}>
                    <Button bsStyle="primary" style={{ margin: '3px' }} type="submit" onClick={this.handleSubmit}>
                        Guardar</Button>
                </div>
            </Fragment>
        );
    }
}