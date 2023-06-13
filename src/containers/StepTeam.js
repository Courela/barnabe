import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Button } from 'react-bootstrap';
import PlayersTable from './PlayersTable';
import Table from '../components/Table';
import errors, { handleError } from '../components/Errors';
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
    
    static async getDerivedStateFromProps(props, state) {
        //debugger;
        var stepId = props.stepId;
        if (stepId && stepId !== state.stepId) {
            return { 
                stepId: stepId,
                players: [],
                staff: []
            };
        }
        return null;
    }
    
    componentDidMount() {
        this.updatePlayersAndStaff();
    }

    componentDidUpdate(prevProps, prevState) {
        //debugger;
        if (this.props.match.params.stepId !== this.state.stepId) {
            //this.updatePlayersAndStaff();
            this.setState({ stepId: prevProps.match.params.stepId, players: [], staff: [] });
        }
    }
    
    updatePlayersAndStaff() {
        this.getPlayers();
        this.getStaff();
    }
    
    getPlayers() {
        if (this.state.players.length === 0) {
            const { season, teamId, stepId } = this.state;
            getPlayers(season, teamId, stepId)
            .then(result => {
                    if (result) {
                        this.setState({ players: result });
                    } else {
                        handleError();
                    }
                })
                .then(() => {
                    if (!this.state.stepName) {
                        getStep(this.state.stepId)
                            .then(step => this.setState({ stepName: step ? step.description : this.state.stepName }))
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
                    this.setState({ staff: result });
                })
                .catch(errors.handleError);
        }
    }

    linkToPlayer(player) {
        const { season, stepId } = this.state;
        return (<Link to={'/seasons/' + season + '/steps/' + stepId + '/players/' + player.id}>{player.person.name}</Link>);
    }

    playerActions(player) {
        const { season, stepId } = this.state;
        if (this.props.isSeasonActive && !this.props.isSignUpExpired) {
            const editUrl = '/seasons/' + season + '/steps/' + stepId + '/players/' + player.id + '?edit=1';
            const removeFn = () => this.removePlayer(player.id, player.person.name);
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
            this.setState({ players: [], staff: [] }, this.updatePlayersAndStaff);
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
        console.log("StepTeam render: ", this.state);
        var staff_columns = [
            { Header: 'Nome', id: 'id', accessor: 'person.name', Cell: (row) => this.linkToPlayer(row.original) },
            { Header: 'Função', id: 'role', accessor: 'role.description' },
            { Header: 'Cartão Cidadão', id: 'idCardNr', accessor: 'person.id_card_number' }
        ];
        if (this.props.isSeasonActive) {
            staff_columns.push({ Header: '', accessor: 'Id', Cell: (row) => this.playerActions(row.original) });
        }

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
                            columns={staff_columns}
                            data={this.state.staff}
                        />
                    </div>
                </div>
            </Fragment>);
    }
}
