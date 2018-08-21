import React from 'react';
import axios from 'axios';
import settings from '../settings';

export default class Statistics extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            statistics: null
        };
    }

    componentDidMount() {
        const url = settings.API_URL + '/api/admin/statistics';
        axios.get(url)
            .then(res => {
                console.log(res.data);
                this.setState({ statistics: res.data });
            })
            .catch(err => console.error(err));
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
                <li>Nr Utilizadores registados: {props.data.nrUsers}</li>
                <li>Nr Equipas sem Utilizador: {props.data.nrTeamsWoutUser}</li>
                <li>Nr Jogadores inscritos na presente época: {props.data.nrPlayers}</li>
                <li>Nr Escalões sem Jogadores inscritos: {props.data.nrStepsWoutPlayers}</li>
            </ul>
        </div>);
}