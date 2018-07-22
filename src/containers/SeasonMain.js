import React, { Component } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';

export default class SeasonMain extends Component {
    handleNewPlayer() {
        this.props.history.push('/seasons/' + this.props.match.params.year + '/steps/0/player');
    }

    handleAddStep() {
        this.props.history.push("/seasons/" + this.props.match.params.year + "/add-step");
    }

    render() {
        return (
            <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.handleAddStep.bind(this)}>Inscrever escalão</Button>
                <Button bsStyle="primary" onClick={this.handleNewPlayer.bind(this)}>Adicionar Jogador</Button>
            </ButtonToolbar>);
    }
} 