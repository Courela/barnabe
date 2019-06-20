import React, { Component } from 'react';
import queryString from 'query-string'
import {
    FormGroup, FormControl, ControlLabel, Button, Form
} from 'react-bootstrap';
//import atob from 'atob';
import errors from '../components/Errors';
import { getSeasons, getTeams, getSteps, getGameTemplate } from '../utils/communications';

export default class MatchSheet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seasons: [],
            teams: [],
            steps: [],
            season: 0,
            homeTeamId: 0,
            awayTeamId: 0,
            stepId: 0,
            data: [],
            exportDataUrl: null,
            loading: false
        };

        this.handleControlChange = this.handleControlChange.bind(this);
        this.getFilters = this.getFilters.bind(this);
        this.fillSearchCriteria = this.fillSearchCriteria.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
    }

    async componentDidMount() {
        await this.getFilters();
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
        const { season, homeTeamId, awayTeamId, stepId } = queryString.parse(props.location.search);
        if (season && homeTeamId && awayTeamId && stepId) {
            //console.log('Set state: ', season, teamId, stepId);
            this.setState({
                season: parseInt(season, 10),
                homeTeamId: parseInt(homeTeamId, 10),
                awayTeamId: parseInt(awayTeamId, 10),
                stepId: parseInt(stepId, 10)
            }, () => this.fetchResults());
        }
    }

    async getFilters() {
        var seasons = await getSeasons().then(results => results.data);
        var activeSeason = seasons.filter(s => s.IsActive)[0];
        var teams = await getTeams().then(results => results.data);
        var steps = await getSteps().then(results => results.data);
        this.setState({ seasons: seasons, teams: teams, steps: steps, season: activeSeason.Year });
    }

    // handleTeamChange(evt) {
    //     const teamId = evt.target.value;
    //     const { season } = this.state;
    //     if (season && teamId) {
    //         axios.get(settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps')
    //             .then(result => {
    //                 this.setState({ steps: result.data, stepId: 0, data: [], exportDataUrl: null });
    //             })
    //             .catch(errors.handleError);
    //     }

    //     this.setState({ [evt.target.name]: teamId });

    //     if (evt) { evt.preventDefault(); }
    // }

    handleControlChange(evt) {
        //console.log(evt);
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal, exportDataUrl: null });
    }

    handleSubmit(evt) {
        const { season, homeTeamId, awayTeamId, stepId } = this.state;
        if (season > 0 && homeTeamId > 0 && awayTeamId > 0 && stepId > 0) {
            this.props.history.push(this.props.location.pathname + '?season=' + season + '&homeTeamId=' + homeTeamId + '&awayTeamId=' + awayTeamId + '&stepId=' + stepId);
        }
        else {
            alert('Escolha todos os critérios de pesquisa.');
        }

        if (evt) { evt.preventDefault(); }
    }

    fetchResults() {
        this.setState({ loading: true }, () => {
            const { season, homeTeamId, awayTeamId, stepId } = this.state;
            //axios.get(settings.API_URL + '/api/admin/templates/game?season=' + season + ' &homeTeamId=' + homeTeamId + ' &awayTeamId=' + awayTeamId + '&stepId=' + stepId)
            getGameTemplate(season, homeTeamId, awayTeamId, stepId)
                .then(result => {
                    const FILE_REGEX = /^data:(.+)\/(.+);base64,/;
                    var buf = Buffer.from(result.data.src.replace(FILE_REGEX, ''), 'base64');
                    var blob = new Blob([buf], { type: "application/pdf" });
                    var url = window.URL.createObjectURL(blob);
                    this.setState({ loading: false, exportDataUrl: url });
                })
                .catch(err => console.error(err));
        });
    }

    render() {
        const { season, homeTeamId, awayTeamId, stepId } = this.state;

        const selectSeasons = this.state.seasons.map((s, idx) => <option key={idx} value={s.Year}>{s.Year}</option>);
        const selectTeams = this.state.teams.map((t, idx) => <option key={idx} value={t.Id}>{t.ShortDescription}</option>);
        const selectSteps = this.state.steps.map((s, idx) => <option key={idx} value={s.Id}>{s.Description}</option>);

        return (
            <div>
                <Form>
                    <FormGroup controlId="selectSeason">
                        <ControlLabel>Época</ControlLabel>
                        <FormControl name="season" componentClass="select" placeholder="select" style={{ width: 200 }}
                            onChange={this.handleControlChange} value={season}>
                            <option value="0">Escolha...</option>
                            {selectSeasons}
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
                    <FormGroup controlId="selectHomeTeam">
                        <ControlLabel>Equipa Visitada</ControlLabel>
                        <FormControl name="homeTeamId" componentClass="select" placeholder="select" style={{ width: 200 }}
                            onChange={this.handleControlChange.bind(this)} value={homeTeamId}>
                            <option value="0">Escolha...</option>
                            {selectTeams}
                        </FormControl>
                        <FormControl.Feedback />
                    </FormGroup>
                    <FormGroup controlId="selectAwayTeam">
                        <ControlLabel>Equipa Visitante</ControlLabel>
                        <FormControl name="awayTeamId" componentClass="select" placeholder="select" style={{ width: 200 }}
                            onChange={this.handleControlChange.bind(this)} value={awayTeamId}>
                            <option value="0">Escolha...</option>
                            {selectTeams}
                        </FormControl>
                        <FormControl.Feedback />
                    </FormGroup>
                    <Button bsStyle="primary" type="submit" onClick={this.handleSubmit} disabled={this.state.loading}>Gerar</Button>
                    <span style={{ display: this.state.loading ? 'inline' : 'none' }}><img src="/show_loader.gif" alt="" style={{ height: '40px', width: '40px' }} /></span>

                    {this.state.exportDataUrl ?
                        <a href={this.state.exportDataUrl} download="ficha_jogo.pdf" target="_blank" rel="noopener noreferrer">Download</a>
                        : ''}
                </Form>
            </div>);
    }
}