import React, { Component } from 'react';

export default class Player extends Component {
    render() {
        return (<div>Ficha de jogador {this.props.match.params.playerId}</div>);
    }
}
