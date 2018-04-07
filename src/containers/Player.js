import React, { Component } from 'react';

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
            <a href="#" onClick={this.handleGoBack}>Voltar</a>
        </div>);
    }
}
