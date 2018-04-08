import React, { Component } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';

export default class Player extends Component {
    constructor(props) {
        super(props);

        this.handleGoBack = this.handleGoBack.bind(this);
    }

    handleGoBack() {
        this.props.history.goBack();
    }

    render() {
        return (
        <div>
            <h1>Ficha de jogador {this.props.match.params.playerId}</h1>
            <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.handleGoBack}>Voltar</Button>
            </ButtonToolbar>
        </div>);
    }
}
