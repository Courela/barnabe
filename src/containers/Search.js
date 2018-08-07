import React, { Component } from 'react';
import {
    FormGroup, FormControl, ControlLabel, Button, Form
} from 'react-bootstrap';
import axios from 'axios';
import Table from '../components/Table';
import settings from '../settings';
import errors from '../components/Errors';
import { dateFormat } from '../utils/formats';

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
            data: []
        }

        this.handleControlChange = this.handleControlChange.bind(this);
        this.getTeams = this.getTeams.bind(this);
        this.getSteps = this.getSteps.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getTeams();
        this.getSteps();
    }

    getTeams() {
        const url = settings.API_URL + '/api/teams';
        axios.get(url)
            .then(results => {
                this.setState({ teams: results.data });
            })
            .catch(errors.handleError);
    }

    getSteps() {
        const url = settings.API_URL + '/api/steps';
        axios.get(url)
            .then(results => {
                this.setState({ steps: results.data });
            })
            .catch(errors.handleError);
    }

    handleControlChange(evt) {
        //console.log(evt);
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmit(evt) {
        const { season, teamId, stepId } = this.state;
        axios.get(settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players')
                .then(result => {
                    //console.log(result);
                    if (result.data && result.data.length > 0) {
                        this.setState({ data: result.data });
                    }
                })
                .catch(errors.handleError);
    }

    render() {
        const selectTeams = this.state.teams.map((t,idx) => <option key={idx} value={t.Id}>{t.ShortDescription}</option>);
        const selectSteps = this.state.steps.map((s,idx) => <option key={idx} value={s.Id}>{s.Description}</option>);

        let columns = [
            { Header: "Nome", accessor: "person.Name" },
            { Header: "Data Nascimento", Cell: (row) => dateFormat(row.original.person.Birthdate) },
            { Header: "Cartão Cidadão", accessor: "person.IdCardNr" },
            { Header: "Equipa", accessor: "player.TeamId" },
            { Header: "Escalão", accessor: "player.StepId" }
        ];

        return (
            <div>
                <Form inline>
                <FormGroup controlId="selectSeason">
                    <ControlLabel>Época</ControlLabel>
                    <FormControl name="season" componentClass="select" placeholder="select" style={{ width: 200 }}
                        onChange={this.handleControlChange} value={this.state.season}>
                        <option value="0">Escolha...</option>
                        <option value="2017">2017</option>
                        <option value="2018">2018</option>
                    </FormControl>
                    <FormControl.Feedback />
                </FormGroup>
                <FormGroup controlId="selectTeam">
                    <ControlLabel>Equipa</ControlLabel>
                    <FormControl name="teamId" componentClass="select" placeholder="select" style={{ width: 200 }}
                        onChange={this.handleControlChange} value={this.state.teamId}>
                        <option value="0">Escolha...</option>
                        {selectTeams}
                    </FormControl>
                    <FormControl.Feedback />
                </FormGroup>
                <FormGroup controlId="selectStep">
                    <ControlLabel>Escalão</ControlLabel>
                    <FormControl name="stepId" componentClass="select" placeholder="select" style={{ width: 200 }}
                        onChange={this.handleControlChange} value={this.state.stepId}>
                        <option value="0">Escolha...</option>
                        {selectSteps}
                    </FormControl>
                    <FormControl.Feedback />
                </FormGroup>
                <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Procurar</Button>
                <Table columns={columns} data={this.state.data}/>
                </Form>
            </div>);
    }
}