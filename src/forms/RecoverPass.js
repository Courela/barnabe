import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: ""
        };
    }

    validateForm() {
        return this.state.email.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    render() {
        return (
            <div style={{padding: 60}}>
                <form onSubmit={this.handleSubmit} 
                    style={{maxWidth: 400, margin: 0, marginLeft: 'auto', marginRight: 'auto'}}>
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit">
                        Recuperar
                    </Button>
                </form>
            </div>);
    }
}
