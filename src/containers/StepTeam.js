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

        this.state = {
            players: [],
            staff: [],
            stepId: props.match.params.stepId,
        };

        this.getPlayers = this.getPlayers.bind(this);
        this.getStaff = this.getStaff.bind(this);
        this.linkToPlayer = this.linkToPlayer.bind(this);
        this.playerActions = this.playerActions.bind(this);
        this.removePlayer = this.removePlayer.bind(this);
        this.handleNewPlayer = this.handleNewPlayer.bind(this);
        this.handleImport = this.handleImport.bind(this);
        this.handleNewStaff = this.handleNewStaff.bind(this);
    }
    
    componentDidMount() {
        this.updatePlayersAndStaff();
    }

    componentDidUpdate() {
        if (this.state.stepId != this.props.match.params.stepId) {
            this.setState({ stepId: this.props.match.params.stepId }, this.updatePlayersAndStaff);
        }
    }
    
    updatePlayersAndStaff() {
        this.getPlayers();
        this.getStaff();
    }
    
    getPlayers() {
        const season = this.props.match.params.year;
        const { stepId, teamId } = this.props;
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
                    getStep(this.props.stepId)
                        .then(step => this.setState({ stepName: step ? step.description : this.state.stepName }))
                        .catch(errors.handleError);
                }
            })
            .catch(errors.handleError);
    }

    getStaff() {
        const season = this.props.match.params.year;
        const { stepId, teamId } = this.props;
        getStaff(season, teamId, stepId)
            .then(result => {
                this.setState({ staff: result });
            })
            .catch(errors.handleError);
    }

    linkToPlayer(player) {
        const season = this.props.match.params.year;
        const { stepId } = this.props;
        return (<Link to={'/seasons/' + season + '/steps/' + stepId + '/players/' + player.id}>{player.person.name}</Link>);
    }

    playerActions(player) {
        const season = this.props.match.params.year;
        const { stepId } = this.props;

        if (this.props.isSeasonActive && !this.props.isSignUpExpired) {
            const editFn = () => this.props.history.push('/seasons/' + season + '/steps/' + stepId + '/players/' + player.id + '?edit=1');
            const removeFn = () => this.removePlayer(player.id, player.person.name);
            return (
                <Fragment>
                    <Button bsStyle="link" bsSize="small" onClick={editFn}>Editar</Button>
                    <Button bsStyle="link" bsSize="small" onClick={removeFn}>Remover</Button>
                </Fragment>
            );
        }
        else return ('');
    }

    async removePlayer(id, name) {
        const season = this.props.match.params.year;
        const { stepId, teamId } = this.props;

        if (window.confirm('Tem a certeza que quer remover o jogador ' + name + '?')) {
            await removePlayer(season, teamId, stepId, id);
            this.setState({ players: [], staff: [] }, this.updatePlayersAndStaff);
        }
    }

    handleNewPlayer() {
        const season = this.props.match.params.year;
        const { stepId } = this.props;

        this.props.history.push('/seasons/' + season + '/steps/' + stepId + '/player');
    };

    handleImport(type) {
        const season = this.props.match.params.year;
        const { stepId } = this.props;
        this.props.history.push('/seasons/' + season + '/steps/' + stepId + '/import?role='+ type);
    }

    handleNewStaff() {
        const season = this.props.match.params.year;
        const { stepId } = this.props;
        
        this.props.history.push('/seasons/' + season + '/steps/' + stepId + '/staff');
    };

    render() {
        const season = this.props.match.params.year;
        const { isSeasonActive, isSignUpExpired } = this.props;

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
                <h2>{this.props.stepName}</h2>
                <div style={{ float: 'right' }}>
                    {isSeasonActive && !isSignUpExpired && this.state.stepName ?
                        <ButtonToolbar>
                            <Button bsStyle="success" onClick={() => this.handleImport('players')}>Importar épocas anteriores</Button>
                            <Button bsStyle="primary" onClick={this.handleNewPlayer}>Adicionar Jogador</Button>
                        </ButtonToolbar> : ''}
                </div>
                <div>
                    <h3>Jogadores</h3>
                    <PlayersTable players={this.state.players} getPlayers={this.getPlayers}
                        linkToPlayer={this.linkToPlayer} playerActions={this.playerActions}
                        isSeasonActive={isSeasonActive} season={season} />
                </div>
                <div style={{ marginTop: '30px', clear: 'right' }}>
                    <div style={{ float: 'right' }}>
                        {isSeasonActive && this.state.stepName ?
                            <ButtonToolbar>
                                <Button bsStyle="success" onClick={() => this.handleImport('staff')}>Importar épocas anteriores</Button>
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
