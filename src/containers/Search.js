import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string'
import {
    FormGroup, FormControl, ControlLabel, Button, Form,
    Glyphicon, Tooltip, OverlayTrigger
} from 'react-bootstrap';
import axios from 'axios';
import Table from '../components/Table';
import settings from '../settings';
import errors from '../components/Errors';
import { dateFormat } from '../utils/formats';
import { isResident, isValidPlayer } from '../utils/validations';

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
        this.getTeams = this.getTeams.bind(this);
        //this.getSteps = this.getSteps.bind(this);
        this.linkToPlayer = this.linkToPlayer.bind(this);
        this.fillSearchCriteria = this.fillSearchCriteria.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
    }

    componentDidMount() {
        this.getTeams();
        //this.getSteps();
        this.fillSearchCriteria(this.props);
    }

    componentWillReceiveProps(nextProps) {
        //console.log('Next: ', nextProps);
        //console.log('Actual: ', this.props);
        if (nextProps.location.search !== this.props.location.search) {
            this.fillSearchCriteria(nextProps);
        }
    }

    fillSearchCriteria(props) {
        const { season, teamId, stepId } = queryString.parse(props.location.search);
        if (season && teamId && stepId) {
            //console.log('Set state: ', season, teamId, stepId);
            this.setState({
                season: parseInt(season),
                teamId: parseInt(teamId),
                stepId: parseInt(stepId)
            }, () => this.fetchResults());
        }
    }

    getTeams() {
        const url = settings.API_URL + '/api/teams';
        axios.get(url)
            .then(results => {
                this.setState({ teams: results.data });
            })
            .catch(errors.handleError);
    }

    // getSteps() {
    //     const url = settings.API_URL + '/api/steps';
    //     axios.get(url)
    //         .then(results => {
    //             this.setState({ steps: results.data });
    //         })
    //         .catch(errors.handleError);
    // }

    handleTeamChange(evt) {
        const teamId = evt.target.value;
        const { season } = this.state;
        if (season && teamId) {
            axios.get(settings.API_URL + '/api/seasons/'+ season + '/teams/' + teamId + '/steps')
                .then(result => {
                    this.setState({ steps: result.data, stepId: 0, data: [], exportDataUrl: null });
                })
                .catch(errors.handleError);
        }

        this.setState({ [evt.target.name]: teamId });

        if(evt) { evt.preventDefault(); }
    }

    handleControlChange(evt) {
        //console.log(evt);
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
        axios.get(settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players')
            .then(result => {
                //console.log(result.data);
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

            axios.get(settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/staff')
            .then(result => {
                //console.log(result.data);
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
        axios.get(settings.API_URL + '/api/admin/export?season=' + season + '&teamId=' + teamId + '&stepId=' + stepId)
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

        const selectTeams = this.state.teams.map((t,idx) => <option key={idx} value={t.Id}>{t.ShortDescription}</option>);
        const selectSteps = this.state.steps.map((s,idx) => <option key={idx} value={s.Id}>{s.Description}</option>);

        let columns = [
            { Header: "", id: 'icon', width: 25, Cell: (row) => statusIcon(row.original) },
            { Header: "Nome", id: 'id', accessor: "person.Name", Cell: (row) => this.linkToPlayer(row) },
            { Header: "Data Nascimento", id: "birthdate", accessor: "person.Birthdate", Cell: (row) => dateFormat(row.original.person.Birthdate) },
            { Header: "Cartão Cidadão", id: "idCardNr", accessor: "person.IdCardNr" },
            { Header: "Estrangeiro", id: "foreign", accessor: "person.VoterNr", Cell: (row) => isResident(row.original) },
            { Header: "Nr Eleitor", id: "voterNr", accessor: "person.VoterNr", Cell: (row) => row.original.caretaker && row.original.caretaker.VoterNr ? row.original.caretaker.VoterNr : row.original.person.VoterNr }
        ];

        return (
            <div>
                <Form inline>
                <FormGroup controlId="selectSeason">
                    <ControlLabel>Época</ControlLabel>
                    <FormControl name="season" componentClass="select" placeholder="select" style={{ width: 200 }}
                        onChange={this.handleControlChange} value={season}>
                        <option value="0">Escolha...</option>
                        <option value="2017">2017</option>
                        <option value="2018">2018</option>
                    </FormControl>
                    <FormControl.Feedback />
                </FormGroup>
                <FormGroup controlId="selectTeam">
                    <ControlLabel>Equipa</ControlLabel>
                    <FormControl name="teamId" componentClass="select" placeholder="select" style={{ width: 200 }}
                        onChange={this.handleTeamChange.bind(this)} value={teamId}>
                        <option value="0">Escolha...</option>
                        {selectTeams}
                    </FormControl>
                    <FormControl.Feedback />
                </FormGroup>
                <FormGroup controlId="selectStep">
                    <ControlLabel>Escalão</ControlLabel>
                    <FormControl name="stepId" componentClass="select" placeholder="select" style={{ width: 200 }}
                        onChange={this.handleControlChange} value={stepId}>
                        <option value="0">Escolha...</option>
                        {selectSteps}
                    </FormControl>
                    <FormControl.Feedback />
                </FormGroup>
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
                                { Header: 'Cartão Cidadão', id: 'idCardNr', accessor: 'person.IdCardNr' }
                            ]}
                            data={this.state.staff} />
                    </div>
                </Form>
            </div>);
    }
}