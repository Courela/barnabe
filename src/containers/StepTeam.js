import React, { Component, Fragment } from 'react';
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
            isSeasonActive: false,
            teamId: props.teamId,
            stepId: props.match.params.stepId,
            stepName: null,
            players: [],
            staff: []
        };

        this.getPlayers = this.getPlayers.bind(this);
        this.getStaff = this.getStaff.bind(this);
        this.linkToPlayer = this.linkToPlayer.bind(this);
        this.playerActions = this.playerActions.bind(this);
        this.removePlayer = this.removePlayer.bind(this);
        this.handleNewPlayer = this.handleNewPlayer.bind(this);
        this.handleNewStaff = this.handleNewStaff.bind(this);
    }

    componentDidMount() {
        this.getPlayers();
        this.getStaff();
    }

    componentWillReceiveProps(newProps) {
        //console.log('New step: ', newProps.match.params.stepId);
        this.setState({ stepId: newProps.match.params.stepId, stepName: null, players: [], staff: [] }, () => {
            this.getPlayers();
            this.getStaff();
        });
    }

    getPlayers() {
        if (this.state.players.length === 0) {
            const { season, teamId, stepId } = this.state;
            axios.get(settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players')
                .then(result => {
                    //console.log(result);
                    if (result.data && result.data.length > 0) {
                        this.setState({ players: result.data });
                    }
                })
                .catch(errors.handleError);
        }
        if (!this.state.stepName) {
            axios.get(settings.API_URL + '/api/steps/' + this.state.stepId)
                .then(result => {
                    //console.log(result);
                    if (result.data) {
                        this.setState({ stepName: result.data.Description });
                    }
                })
                .catch(errors.handleError);
        }
    }

    getStaff() {
        if (this.state.staff.length === 0) {
            const { season, teamId, stepId } = this.state;
            axios.get(settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/staff')
                .then(result => {
                    //console.log(result);
                    if (result.data && result.data.length > 0) {
                        this.setState({ staff: result.data });
                    }
                })
                .catch(errors.handleError);
        }
    }

    linkToPlayer(row) {
        const { season, stepId } = this.state;
        return (<Link to={'/seasons/' + season + '/steps/' + stepId + '/players/' + row.original.Id}>{row.original.Name}</Link>);
    }

    playerActions(row) {
        const { season, stepId } = this.state;
        const editUrl = '/seasons/' + season + '/steps/' + stepId + '/players/' + row.original.Id + '?edit=1';
        const removeFn = (evt) => this.removePlayer(row.original.Id, row.original.Name);
        return (
            <Fragment>
                <Button bsStyle="link" bsSize="small" href={editUrl}>Editar</Button>
                <Button bsStyle="link" bsSize="small" onClick={removeFn}>Remover</Button>
            </Fragment>
        );
    }

    async removePlayer(id, name) {
        const { season, teamId, stepId } = this.state;
        if (window.confirm('Tem a certeza que quer remover o jogador ' + name + '?')) {
            await axios.delete(settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + id);
            this.setState({ players: [], staff: [] }, () => {
                this.getPlayers();
                this.getStaff();
            });
        }
    }

    handleNewPlayer() {
        const { season, stepId } = this.state;
        this.props.history.push('/seasons/' + season + '/steps/' + stepId + '/player');
    };

    handleNewStaff() {
        const { season, stepId } = this.state;
        this.props.history.push('/seasons/' + season + '/steps/' + stepId + '/staff');
    };

    render() {
        return (
            <Fragment>
                <h2>{this.state.stepName}</h2>
                <div style={{ float: 'right' }}>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={this.handleNewPlayer}>Adicionar Jogador</Button>
                        {this.state.isSeasonActive ?
                            <Button bsStyle="primary" href={'/seasons/' + (this.state.season - 1).toString() + '/steps/' + this.state.stepId + '/import'}>Importar Jogadores {this.state.season - 1}</Button> :
                            ''}
                    </ButtonToolbar>
                </div>
                <div>
                    <h3>Jogadores</h3>
                    <PlayersTable players={this.state.players} getPlayers={this.getPlayers}
                        linkToPlayer={this.linkToPlayer} playerActions={this.playerActions} />
                </div>
                <div style={{ marginTop: '30px', clear: 'right' }}>
                    <div style={{ float: 'right' }}>
                        <ButtonToolbar>
                            <Button bsStyle="primary" onClick={this.handleNewStaff}>Adicionar Elemento</Button>
                        </ButtonToolbar>
                    </div>
                    <h3>Equipa Técnica</h3>
                    <div>
                        <ReactTable
                            columns={[
                                { Header: "Nome", id: 'Id', Cell: (row) => this.linkToPlayer(row) },
                                { Header: "Cartão Cidadão", accessor: "IdCardNr" },
                                { Header: "Data Nascimento", Cell: (row) => dateFormat(row.original.Birthdate) },
                                { Header: "", accessor: 'Id', Cell: (row) => this.playerActions(row) }
                            ]}
                            data={this.state.staff}
                            minRows={Math.max(Math.min(this.state.staff.length, 5), 1)}
                            onFetchData={this.getStaff}
                            defaultPageSize={5}
                            className="-striped" />
                    </div>
                </div>
            </Fragment>);
    }
}

function PlayersTable(props) {
    return (<div>
        <ReactTable
            columns={[
                { Header: "Nome", id: 'Id', Cell: (row) => props.linkToPlayer(row) },
                { Header: "Data Nascimento", Cell: (row) => dateFormat(row.original.Birthdate) },
                { Header: "Cartão Cidadão", accessor: "IdCardNr" },
                { Header: "", accessor: 'Id', Cell: (row) => props.playerActions(row) }
            ]}
            data={props.players}
            minRows={Math.max(Math.min(props.players.length, 5), 1)}
            onFetchData={props.getPlayers}
            defaultPageSize={5}
            className="-striped" />
    </div>);
}

function dateFormat(date) {
    console.log(date);
    if (!date) { return ''; }
     
    const dateObj = new Date(date);
    var dd = dateObj.getDate();
    var mm = dateObj.getMonth() + 1; //January is 0!

    var yyyy = dateObj.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
}