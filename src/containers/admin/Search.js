import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import {  Button, Form, Glyphicon, Tooltip, OverlayTrigger} from 'react-bootstrap';
import { SeasonSelect, TeamSelect, StepSelect } from '../../components/Controls';
import Table from '../../components/Table';
import errors from '../../components/Errors';
import { dateFormat } from '../../utils/formats';
import { isResident, isValidPlayer } from '../../utils/validations';
import { getTeams, getTeamSteps, getPlayers, getStaff, exportPlayers, getSeasons } from '../../utils/communications';

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
        //this.getSteps = this.getSteps.bind(this);
        this.linkToPlayer = this.linkToPlayer.bind(this);
        this.fillSearchCriteria = this.fillSearchCriteria.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
    }

    async componentDidMount() {
        await this.getSeasons();
        //this.getSteps();
        this.fillSearchCriteria(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.fillSearchCriteria(nextProps);
        }
    }

    fillSearchCriteria(props) {
        const { season, teamId, stepId } = queryString.parse(props.location.search);
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

    async getSeasons() {
        var seasons = await getSeasons().then(results => results.data);
        var teams = await getTeams().then(results => results.data);
        this.setState({ seasons: seasons, teams: teams });
    }

    // getSteps() {
    //     const url = settings.API_URL + '/api/steps';
    //     axios.get(url)
    //         .then(results => {
    //             this.setState({ steps: results.data });
    //         })
    //         .catch(errors.handleError);
    // }

    getSteps(season, teamId, stepId = 0, callback = null) {
        getTeamSteps(season, teamId)
            .then(result => {
                this.setState({ steps: result.data, stepId: stepId, data: [], exportDataUrl: null }, callback);
            })
            .catch(errors.handleError);
    }

    handleSeasonChange(evt) {
        const season = evt.target.value;
        const { teamId } = this.state;
        if (season && teamId) {
            this.getSteps(season, teamId);
        }

        this.handleControlChange(evt);

        if(evt) { evt.preventDefault(); }
    }

    handleTeamChange(evt) {
        const teamId = evt.target.value;
        const { season } = this.state;
        if (season && teamId) {
            this.getSteps(season, teamId);
        }

        this.handleControlChange(evt);

        if(evt) { evt.preventDefault(); }
    }

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmit(evt) {
        const { season, teamId, stepId } = this.state;
        if (season > 0 && teamId > 0 && stepId > 0) {
            this.props.history.push(this.props.location.pathname + '?season=' + season + '&teamId=' + teamId + '&stepId=' + stepId);
        }
        else {
            alert('Escolha todos os critérios de pesquisa.');
        }
        
        if(evt) { evt.preventDefault(); }
    }

    fetchResults() {
        const { season, teamId, stepId } = this.state;
        getPlayers(season, teamId, stepId)
            .then(result => {
                if (result.data && result.data.length > 0) {
                    this.setState({ data: result.data, exportDataUrl: null });
                }
                else {
                    this.setState({ data: [], exportDataUrl: null });
                }
            })
            .catch(err => { 
                this.setState({ data: [], exportDataUrl: null });
                errors.handleError(err);
            });

        getStaff(season, teamId, stepId)
            .then(result => {
                if (result.data && result.data.length > 0) {
                    this.setState({ staff: result.data, exportDataUrl: null });
                }
                else {
                    this.setState({ staff: [], exportDataUrl: null });
                }
            })
            .catch(err => { 
                this.setState({ staff: [], exportDataUrl: null });
                errors.handleError(err);
            });
    }

    linkToPlayer(row) {
        const { season, teamId, stepId } = this.state;
        return (<Link to={'/admin/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + row.original.Id}>{row.original.person.Name}</Link>);
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
            { Header: "Nome", id: 'id', accessor: "person.Name", Cell: (row) => this.linkToPlayer(row) },
            { Header: "Data Nascimento", id: "birthdate", accessor: "person.Birthdate", Cell: (row) => dateFormat(row.original.person.Birthdate) },
            { Header: "Cartão Cidadão", id: "idCardNr", accessor: "person.IdCardNr" },
            { Header: "Estrangeiro", id: "foreign", accessor: "person.VoterNr", Cell: (row) => isResident(row.original) },
            { Header: "Data inscrição", id: "createdAt", accessor: "CreatedAt" },
            { Header: "Última alteração", id: "updatedAt", accessor: "LastUpdatedAt" }
        ];

        return (
            <Form inline>
                <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange.bind(this)} />
                <TeamSelect teams={this.state.teams} value={teamId} onChange={this.handleTeamChange.bind(this)} />
                <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleControlChange} />
                <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Procurar</Button>
                <h3>Jogadores</h3>
                <Table columns={columns} data={this.state.data}/>
                {this.state.data.length > 0 ?
                    <Button bsStyle="primary" onClick={this.prepareExport.bind(this)}>Exportar</Button> : ''
                }
                {this.state.exportDataUrl ?
                    <a href={this.state.exportDataUrl} download="export.csv" target="_blank" rel="noopener noreferrer">Download</a>
                    : ''}

                <h3>Equipa Técnica</h3>
                    <div>
                        <Table
                            columns={[
                                { Header: 'Nome', id: 'id', accessor: 'person.Name', Cell: (row) => this.linkToPlayer(row) },
                                { Header: 'Função', id: 'role', accessor: 'role.Description' },
                                { Header: 'Cartão Cidadão', id: 'idCardNr', accessor: 'person.IdCardNr' },
                                { Header: "Data inscrição", id: "createdAt", accessor: "CreatedAt" },
                                { Header: "Última alteração", id: "updatedAt", accessor: "LastUpdatedAt" }
                            ]}
                            data={this.state.staff} />
                    </div>
            </Form>);
    }
}