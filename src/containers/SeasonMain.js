import React, { Component } from 'react';
import errors from '../components/Errors';
import { getTeam } from '../utils/communications';

export default class SeasonMain extends Component {
    constructor(props) {
        super(props);

        this.updateSeasonActive = this.updateSeasonActive.bind(this);
        this.getTeam = this.getTeam.bind(this);

        const season = props.match.params.year;
        this.state = {
            season: season,
            isSeasonActive: props.isSeasonActive,
            teamId: props.teamId,
            team: null
        };
    }

    componentDidMount() {
        this.updateSeasonActive(this.props.isSeasonActive);
        this.getTeam();
    }

    componentWillReceiveProps(newProps) {
        this.updateSeasonActive(newProps.isSeasonActive)
    }

    updateSeasonActive(isSeasonActive) {
        if (isSeasonActive && isSeasonActive !== this.state.isSeasonActive) {
            this.setState({ isSeasonActive: isSeasonActive });
        }
    }

    getTeam() {
        const { team, teamId } = this.state; 
        if (!team || team.Id !== teamId) {
            getTeam(teamId)
                .then(res => {
                    console.log('Team result: ', res.data);
                    this.setState({ team: res.data });
                })
                .catch(errors.handleError);
        }
    }

    handleNewPlayer() {
        this.props.history.push('/seasons/' + this.props.match.params.year + '/steps/0/player');
    }

    handleAddStep() {
        this.props.history.push("/seasons/" + this.props.match.params.year + "/add-step");
    }

    render() {
        return (
            <div>
                <h2>Época {this.state.season}</h2>
                <h3>{this.state.team ? this.state.team.Name : ''}</h3>
                {/* {this.state.isSeasonActive ?
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={this.handleAddStep.bind(this)}>Inscrever escalão</Button>
                        <Button bsStyle="primary" onClick={this.handleNewPlayer.bind(this)}>Adicionar Jogador</Button>
                    </ButtonToolbar> : ''} */}
            </div>);
    }
} 