import React from 'react';
import { getStatistics } from '../../utils/communications';

export default class Statistics extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            statistics: null
        };
    }

    componentDidMount() {
        getStatistics()
            .then(statistics => {
                this.setState({ statistics: statistics });
            });
    }

    render() {
        return (
            <div>
                {this.state.statistics ? <StatDetail data={this.state.statistics} /> : ''}
            </div>);
    }
}

function StatDetail(props) {
    return (
        <div>
            <ul>
                <li>Nr Utilizadores registados: {props.data.NrUsers}</li>
                <li>Nr Equipas sem Utilizador: {props.data.NrTeamsWithoutUser}</li>
                <li>Nr Jogadores inscritos na presente época: {props.data.NrPlayers}</li>
                <li>Nr Escalões sem Jogadores inscritos: {props.data.NrStepsWithoutPlayers}</li>
            </ul>
        </div>);
}