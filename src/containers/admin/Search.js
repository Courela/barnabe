import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {  Button, Form, Glyphicon, Tooltip, OverlayTrigger} from 'react-bootstrap';
import { SeasonSelect, TeamSelect, StepSelect } from '../../components/Controls';
import Table from '../../components/Table';
import errors from '../../components/Errors';
import { dateFormat } from '../../utils/formats';
import { isResident, isValidPlayer } from '../../utils/validations';
import { getTeams, getTeamSteps, getPlayers, getStaff, exportPlayers, getSeasons } from '../../utils/communications';
import { Fragment } from 'react';

export default class Seach extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seasons: [],
            teams: [],
            steps: [],
            season: 0,
            teamId: 0,
            stepId: 0,
            data: [],
            staff: [],
            exportDataUrl: null
        };

        this.handleControlChange = this.handleControlChange.bind(this);
        this.getSeasons = this.getSeasons.bind(this);
        this.linkToPlayer = this.linkToPlayer.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
        this.populatePlayers = this.populatePlayers.bind(this);
    }

    async componentDidMount() {
        await this.getSeasons();
    }

    async getSeasons() {
        var seasons = await getSeasons();
        var teams = await getTeams();
        this.setState({ seasons: seasons, teams: teams });
    }

    getSteps(season, teamId, stepId = 0, callback = null) {
        getTeamSteps(season, teamId)
            .then(steps => {
                this.setState({ steps: steps.map(s => Object.assign(s, { id: s.stepId })), stepId: stepId, data: [], staff: [], exportDataUrl: null }, callback);
            })
            .catch(errors.handleError);
    }

    handleSeasonChange(evt) {
        var fn = (state) => {
            const { season, teamId } = state;
            if (season && teamId) {
                this.getSteps(season, teamId);
            }
        }

        this.handleControlChange(evt, fn);
    }

    handleTeamChange(evt) {
        const teamId = evt.target.value;
        const { season } = this.state;
        if (season && teamId) {
            this.getSteps(season, teamId);
        }

        this.handleControlChange(evt);
    }

    handleStepChange(evt) {
        var fn = (state) => {
            const { season, teamId, stepId } = state;
            if (season && teamId && stepId) {
                this.fetchResults();
            }
        }

        this.handleControlChange(evt, fn);
    }

    handleControlChange(evt, fn) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal }, fn ? () => fn(this.state) : null);
    }

    populatePlayers(season, teamId, stepId) {
        if (season && teamId && stepId) {
            this.getSteps(parseInt(season, 10), parseInt(teamId, 10), parseInt(stepId, 10), () => {
                this.setState({
                    season: parseInt(season, 10),
                    teamId: parseInt(teamId, 10),
                    stepId: parseInt(stepId, 10)
                }, () => this.fetchResults());
            });
        }
    }

    fetchResults() {
        const { season, teamId, stepId } = this.state;
        getPlayers(season, teamId, stepId)
            .then(players => {
                this.setState({ data: players, exportDataUrl: null });
            })
            .catch(err => { 
                this.setState({ data: [], exportDataUrl: null });
                errors.handleError(err);
            });

        getStaff(season, teamId, stepId)
            .then(staff => {
                this.setState({ staff: staff, exportDataUrl: null });
            })
            .catch(err => { 
                this.setState({ staff: [], exportDataUrl: null });
                errors.handleError(err);
            });
    }

    linkToPlayer(row) {
        const { season, teamId, stepId } = this.state;
        return (<Link to={'/admin/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + row.original.id}>{row.original.person.name}</Link>);
    }

    prepareExport() {
        const { season, teamId, stepId } = this.state;
        exportPlayers(season, teamId, stepId)
            .then(result => {
                var blob = new Blob([result.data.data], {type: "txt/csv"});
                var url = window.URL.createObjectURL(blob);
                this.setState({ exportDataUrl: url });
            })
            .catch(err => console.error(err));
    }

    render() {
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

        const { season, teamId, stepId } = this.state;

        let columns = [
            { Header: "", id: 'icon', width: 25, Cell: (row) => statusIcon(row.original) },
            { Header: "Nome", id: 'id', accessor: "person.name", Cell: (row) => this.linkToPlayer(row) },
            { Header: "Data Nascimento", id: "birthdate", accessor: "person.birthdate", Cell: (row) => dateFormat(row.original.person.birthdate) },
            { Header: "Cartão Cidadão", id: "idCardNr", accessor: "person.id_card_number" },
            { Header: "Estrangeiro", id: "foreign", accessor: "person.voter_nr", Cell: (row) => isResident(row.original) }
        ];

        if (stepId != 3) {
            columns.push({ Header: "CC Responsável", id: "caretakerIdCardNr", accessor: "caretaker.id_card_number" });
        }

        columns.push(
            { Header: "Data inscrição", id: "createdAt", accessor: "CreatedAt" },
            { Header: "Última alteração", id: "updatedAt", accessor: "LastUpdatedAt" });

        return (
            <Form inline>
                <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange.bind(this)} />
                <TeamSelect teams={this.state.teams} value={teamId} onChange={this.handleTeamChange.bind(this)} />
                <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleStepChange.bind(this)} />
                {season && teamId && stepId ?
                    <Fragment>
                        <h3>Jogadores</h3>
                        <Table columns={columns} data={this.state.data}/>
                        {this.state.data && this.state.data.length > 0 ?
                            <Button bsStyle="primary" onClick={this.prepareExport.bind(this)}>Exportar</Button> : ''
                        }
                        {this.state.exportDataUrl ?
                            <a href={this.state.exportDataUrl} download="export.csv" target="_blank" rel="noopener noreferrer">Download</a>
                            : ''}

                        <h3>Equipa Técnica</h3>
                            <div>
                                <Table
                                    columns={[
                                        { Header: 'Nome', id: 'id', accessor: 'person.name', Cell: (row) => this.linkToPlayer(row) },
                                        { Header: 'Função', id: 'role', accessor: 'role.description' },
                                        { Header: 'Cartão Cidadão', id: 'idCardNr', accessor: 'person.id_card_number' },
                                        { Header: "Data inscrição", id: "createdAt", accessor: "CreatedAt" },
                                        { Header: "Última alteração", id: "updatedAt", accessor: "LastUpdatedAt" }
                                    ]}
                                    data={this.state.staff} />
                            </div>
                        </Fragment> : "" }
            </Form>);
    }
}