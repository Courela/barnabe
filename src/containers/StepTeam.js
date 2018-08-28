import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Button, Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import Table from '../components/Table';
import settings from '../settings';
import errors from '../components/Errors';
import { dateFormat } from '../utils/formats';
import { isValidEmail, isValidPhone, isResident, isValidPlayer } from '../utils/validations';

export default class StepTeam extends Component {
    constructor(props) {
        super(props);

        const season = props.match.params.year;

        this.state = {
            season: season,
            isSeasonActive: props.isSeasonActive,
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

        const isSeasonActive = this.props.isSeasonActive;
        if (isSeasonActive && isSeasonActive !== this.state.isSeasonActive) {
            this.setState({ isSeasonActive: isSeasonActive });
        }
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
                .then(res => {
                    if (!this.state.stepName) {
                        axios.get(settings.API_URL + '/api/steps/' + this.state.stepId)
                            .then(result => {
                                if (result.data) {
                                    this.setState({ stepName: result.data.Description });
                                }
                            })
                            .catch(errors.handleError);
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

    linkToPlayer(player) {
        const { season, stepId } = this.state;
        return (<Link to={'/seasons/' + season + '/steps/' + stepId + '/players/' + player.Id}>{player.person.Name}</Link>);
    }

    playerActions(player) {
        const { season, stepId, isSeasonActive } = this.state;
        if (isSeasonActive) {
            const editUrl = '/seasons/' + season + '/steps/' + stepId + '/players/' + player.Id + '?edit=1';
            const removeFn = (evt) => this.removePlayer(player.Id, player.person.Name);
            return (
                <Fragment>
                    <Button bsStyle="link" bsSize="small" href={editUrl}>Editar</Button>
                    <Button bsStyle="link" bsSize="small" onClick={removeFn}>Remover</Button>
                </Fragment>
            );
        }
        else return ('');
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
                    {this.state.isSeasonActive && this.state.stepName ?
                        <ButtonToolbar>
                            <Button bsStyle="success" href={'/seasons/' + (this.state.season).toString() + '/steps/' + this.state.stepId + '/import'}>Importar épocas anteriores</Button>
                            <Button bsStyle="primary" onClick={this.handleNewPlayer}>Adicionar Jogador</Button>
                        </ButtonToolbar> : ''}
                </div>
                <div>
                    <h3>Jogadores</h3>
                    <PlayersTable players={this.state.players} getPlayers={this.getPlayers}
                        linkToPlayer={this.linkToPlayer} playerActions={this.playerActions}
                        isSeasonActive={this.state.isSeasonActive} />
                </div>
                <div style={{ marginTop: '30px', clear: 'right' }}>
                    <div style={{ float: 'right' }}>
                        {this.state.isSeasonActive && this.state.stepName ?
                            <ButtonToolbar>
                                <Button bsStyle="primary" onClick={this.handleNewStaff}>Adicionar Elemento</Button>
                            </ButtonToolbar> : ''}
                    </div>
                    <h3>Equipa Técnica</h3>
                    <div>
                        <Table
                            columns={[
                                { Header: "Nome", id: 'Id', Cell: (row) => this.linkToPlayer(row.original) },
                                { Header: "Cartão Cidadão", accessor: "person.IdCardNr" },
                                { Header: "Data Nascimento", Cell: (row) => dateFormat(row.original.person.Birthdate) },
                                { Header: "", accessor: 'Id', Cell: (row) => this.playerActions(row.original) }
                            ]}
                            data={this.state.staff}
                            onFetchData={this.getStaff}  />
                    </div>
                </div>
            </Fragment>);
    }
}

function PlayersTable(props) {
    const statusIcon = (player) => {
        const tooltip = <Tooltip id="tooltip">Dados em falta!</Tooltip>;

        const isValid = isValidPlayer(player);
        if (isValid) {
            return <Glyphicon glyph="ok-sign" style={{ color: 'green' }}/>
        }
        else {
            return (
                <OverlayTrigger placement="left" overlay={tooltip}>
                    <Glyphicon glyph="remove-sign" style={{ color: 'red' }} />
                </OverlayTrigger>);
        }
    };

    // const isResident = (row) => {
    //     console.log('Row:',row);
    //     const { person, caretaker } = row.original;
    //     const result = caretaker && caretaker.VoterNr ? '' : (person.VoterNr ? '' : 'Sim');
    //     return result;
    // }

    let columns = [
        { Header: "Nome", id: 'id', accessor: "person.Name", Cell: (row) => props.linkToPlayer(row.original) },
        { Header: "Data Nascimento", id: "birthdate", accessor: "person.Birthdate", Cell: (row) => dateFormat(row.original.person.Birthdate) },
        { Header: "Cartão Cidadão", id: "idCardNr", accessor: "person.IdCardNr" },
        { Header: "Estrangeiro", id: "foreign", Cell: (row) => isResident(row.original) },
        { Header: "Nr Eleitor", id: "voterNr", accessor: "person.VoterNr", Cell: (row) => row.original.caretaker && row.original.caretaker.VoterNr ? row.original.caretaker.VoterNr : row.original.person.VoterNr },
        { Header: "", id: "actions", accessor: 'Id', Cell: (row) => props.playerActions(row.original) }
    ];

    if (props.isSeasonActive) {
        columns.splice(0, 0, { Header: "", id: 'icon', accessor: "Id", width: 25, Cell: (row) => statusIcon(row.original) });
    }

    return (<div>
        <Table
            columns={columns}
            data={props.players}
            onFetchData={props.getPlayers} />
    </div>);
}
