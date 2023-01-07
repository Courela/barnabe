import React, { Component } from 'react';
import { Fragment } from 'react';
import { Button } from 'react-bootstrap';
import { FieldGroup } from '../utils/controls';

export default class UserForm extends Component {
    constructor(props, context) {
        super(props, context);

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

    handleSubmit(evt) {
        evt.preventDefault();
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
                    />
                    <FieldGroup
                        id="formPassword"
                        type="password"
                        name="password"
                        label="Palavra-passe"
                        placeholder="Password"
                        onChange={this.handleControlChange}
                    />
                </form>
                <div style={{ display: 'flex', flexDirection: 'row-reverse', padding: '5px' }}>
                    <Button bsStyle="primary" style={{ margin: '3px' }} type="submit" onClick={this.handleSubmit}>
                        Guardar</Button>
                </div>
                <form>
                    <FieldGroup
                        id="formEmail"
                        type="text"
                        name="email"
                        label="Email"
                        placeholder="Email"
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