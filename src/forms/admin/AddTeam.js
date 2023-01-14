import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { FieldGroup } from '../../components/Controls';
import { createTeam } from '../../utils/communications';

export default class AddTeam extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleControlChange = this.handleControlChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            name: '',
            shortDescription: ''
        }
    }

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmit(evt) {
        if (this.state.name.length > 0) {
            const { name, shortDescription } = this.state;
            createTeam(name, shortDescription)
                .then(() => {
                    alert('Colectividade criada com sucesso.');
                })
                .catch(err => {
                    console.error(err);
                    alert('Erro ao criar colectividade.');
                });
        }
        evt.preventDefault();
    }

    render() {
        return (
            <form>
                <FieldGroup
                    id="formName"
                    type="text"
                    name="name"
                    label="Colectividade"
                    placeholder="Colectividade"
                    onChange={this.handleControlChange}
                />
                <FieldGroup
                    id="formShortDescription"
                    type="text"
                    name="shortDescription"
                    label="Abreviatura"
                    placeholder="Abreviatura"
                    onChange={this.handleControlChange}
                />
                <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Guardar</Button>
            </form>);
    }
}
