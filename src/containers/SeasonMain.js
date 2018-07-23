import React, { Component, Fragment } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';

export default class SeasonMain extends Component {
    constructor(props) {
        super(props);

        const season = props.match.params.year;
        this.state = {
            season: season,
            isSeasonActive: season == 2018,
            teamId: props.teamId,
        };
    }
    handleNewPlayer() {
        this.props.history.push('/seasons/' + this.props.match.params.year + '/steps/0/player');
    }

    handleAddStep() {
        this.props.history.push("/seasons/" + this.props.match.params.year + "/add-step");
    }

    render() {
        return (<Fragment>
            {this.state.isSeasonActive ? 
                <ButtonToolbar>
                    <Button bsStyle="primary" onClick={this.handleAddStep.bind(this)}>Inscrever escalão</Button>
                    <Button bsStyle="primary" onClick={this.handleNewPlayer.bind(this)}>Adicionar Jogador</Button>
                </ButtonToolbar> : ''}
            </Fragment>);
    }
} 