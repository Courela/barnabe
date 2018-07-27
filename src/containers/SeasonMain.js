import React, { Component, Fragment } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';

export default class SeasonMain extends Component {
    constructor(props) {
        super(props);

        const season = props.match.params.year;
        this.state = {
            season: season,
            isSeasonActive: props.isSeasonActive,
            teamId: props.teamId,
        };
    }

    componentDidMount() {
        const isSeasonActive = this.props.isSeasonActive;
        if (isSeasonActive && isSeasonActive !== this.state.isSeasonActive) {
            this.setState({ isSeasonActive: isSeasonActive });
        }
    }

    componentWillReceiveProps(newProps) {
        const isSeasonActive = newProps.isSeasonActive;
        if (isSeasonActive && isSeasonActive !== this.state.isSeasonActive) {
            this.setState({ isSeasonActive: isSeasonActive });
        }
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