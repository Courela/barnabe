import React, { Component } from 'react';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Button } from 'react-bootstrap';
import axios from 'axios';
import settings from '../settings';
import errors from '../components/Errors';

export default class StepTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            season: props.match.params.year,
            teamId: props.teamId,
            stepId: props.match.params.stepId,
            data: []
        };

        this.getData = this.getData.bind(this);
        this.linkToPlayer = this.linkToPlayer.bind(this);
        this.handleNewPlayer = this.handleNewPlayer.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const { season, teamId, stepId } = this.state;
        axios.get(settings.API_URL + '/api/season/' + season + '/team/' + teamId + '/step/' + stepId + '/player')
            .then(result => {
                console.log(result);
                if (result.data && result.data.length > 0) {
                    this.setState({ data: result.data });
                }
            })
            .catch(errors.handleError);
        // return [
        //     { id: 1, name: 'Jogador 1', birthdate: new Date(2000, 1, 1).toString() },
        //     { id: 2, name: 'Jogador 2', birthdate: new Date(2000, 1, 2).toString() },
        //     { id: 3, name: 'Jogador 3', birthdate: new Date(2000, 1, 1).toString() },
        //     { id: 4, name: 'Jogador 4', birthdate: new Date(2000, 1, 2).toString() },
        //     { id: 5, name: 'Jogador 5', birthdate: new Date(2000, 1, 1).toString() },
        //     { id: 6, name: 'Jogador 6', birthdate: new Date(2000, 1, 2).toString() }
        // ];
    }

    linkToPlayer(row, edit) {
        const { season, stepId } = this.state;
        const queryString = edit ? '?edit' : '';
        const text = edit ? "Editar" : row.original.Name;
        return (<Link to={'/season/' + season + '/step/' + stepId + '/player/' + row.original.Id + queryString}>{text}</Link>);
    }

    handleNewPlayer() {
        const { season, stepId } = this.state;
        this.props.history.push('/season/' + season + '/step/' + stepId + '/player');
    };

    render() {
        return (
            <div>
                <h2>Escalão {this.state.stepId}</h2>
                <div>
                    <div style={{ float: 'right' }}>
                        <ButtonToolbar>
                            <Button bsStyle="primary" onClick={this.handleNewPlayer}>Adicionar Jogador</Button>
                        </ButtonToolbar>
                    </div>
                </div>
                <div style={{ clear: 'right' }}>
                    <div>
                        <ReactTable
                            columns={[
                                { Header: "Nome", id: 'Id', Cell: (row) => this.linkToPlayer(row, false) },
                                { Header: "Data Nascimento", accessor: "Birthdate" },
                                { Header: "Cartão Cidadão", accessor: "IdCardNr" },
                                { Header: "", accessor: 'Id', Cell: (row) => this.linkToPlayer(row, true) } 
                            ]}
                            data={this.state.data}
                            minRows={Math.max(Math.min(this.state.data.length, 5), 1)}
                            onFetchData={this.getData}
                            defaultPageSize={5}
                            className="-striped" />
                    </div>
                </div>
            </div>);
    }
}