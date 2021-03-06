import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Button, Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap';
import Table from '../components/Table';
import errors from '../components/Errors';
import { dateFormat } from '../utils/formats';
import { isResident, isValidPlayer } from '../utils/validations';
import { getPlayers, getStep, getStaff, removePlayer } from '../utils/communications';

export default class StepTeam extends Component {
    constructor(props) {
        super(props);

        const season = props.match.params.year;

        this.state = {
            season: season,
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
            getPlayers(season, teamId, stepId)
                .then(result => {
                    //console.log(result);
                    if (result.data && result.data.length > 0) {
                        this.setState({ players: result.data });
                    }
                })
                .then(res => {
                    if (!this.state.stepName) {
                        getStep(this.state.stepId)
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
            getStaff(season, teamId, stepId)
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
        const { season, stepId } = this.state;
        if (this.props.isSeasonActive && !this.props.isSignUpExpired) {
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
            await removePlayer(season, teamId, stepId, id);
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
                    {this.props.isSeasonActive && !this.props.isSignUpExpired && this.state.stepName ?
                        <ButtonToolbar>
                            <Button bsStyle="success" href={'/seasons/' + (this.state.season).toString() + '/steps/' + this.state.stepId + '/import?role=players'}>Importar épocas anteriores</Button>
                            <Button bsStyle="primary" onClick={this.handleNewPlayer}>Adicionar Jogador</Button>
                        </ButtonToolbar> : ''}
                </div>
                <div>
                    <h3>Jogadores</h3>
                    <PlayersTable players={this.state.players} getPlayers={this.getPlayers}
                        linkToPlayer={this.linkToPlayer} playerActions={this.playerActions}
                        isSeasonActive={this.props.isSeasonActive} season={this.state.season} />
                </div>
                <div style={{ marginTop: '30px', clear: 'right' }}>
                    <div style={{ float: 'right' }}>
                        {this.props.isSeasonActive && this.state.stepName ?
                            <ButtonToolbar>
                                <Button bsStyle="success" href={'/seasons/' + (this.state.season).toString() + '/steps/' + this.state.stepId + '/import?role=staff'}>Importar épocas anteriores</Button>
                                <Button bsStyle="primary" onClick={this.handleNewStaff}>Adicionar Elemento</Button>
                            </ButtonToolbar> : ''}
                    </div>
                    <h3>Equipa Técnica</h3>
                    <div>
                        <Table
                            columns={[
                                { Header: 'Nome', id: 'id', accessor: 'person.Name', Cell: (row) => this.linkToPlayer(row.original) },
                                { Header: 'Função', id: 'role', accessor: 'role.Description' },
                                { Header: 'Cartão Cidadão', id: 'idCardNr', accessor: 'person.IdCardNr' },
                                { Header: '', accessor: 'Id', Cell: (row) => this.playerActions(row.original) }
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

    let columns = [
        { Header: "Nome", id: 'id', accessor: "person.Name", Cell: (row) => props.linkToPlayer(row.original) },
        { Header: "Data Nascimento", id: "birthdate", accessor: "person.Birthdate", Cell: (row) => dateFormat(row.original.person.Birthdate) },
        { Header: "Cartão Cidadão", id: "idCardNr", accessor: "person.IdCardNr" },
        { Header: "Estrangeiro", id: "foreign", Cell: (row) => isResident(row.original) },
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
