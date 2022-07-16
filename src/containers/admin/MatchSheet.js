import React, { Component } from 'react';
import queryString from 'query-string';
import { Button, Form } from 'react-bootstrap';
//import atob from 'atob';
import { SeasonSelect, StepSelect, TeamSelect } from '../../components/Controls';
import { getSeasons, getTeams, getSteps, getGameTemplate } from '../../utils/communications';

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

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.fillSearchCriteria(nextProps);
        }
    }

    fillSearchCriteria(props) {
        const { season, homeTeamId, awayTeamId, stepId } = queryString.parse(props.location.search);
        if (season && homeTeamId && awayTeamId && stepId) {
            this.setState({
                season: parseInt(season, 10),
                homeTeamId: parseInt(homeTeamId, 10),
                awayTeamId: parseInt(awayTeamId, 10),
                stepId: parseInt(stepId, 10)
            }, () => this.fetchResults());
        }
    }

    async getFilters() {
        var seasons = await getSeasons();
        var activeSeason = seasons.find(s => s.is_active);
        var teams = await getTeams();
        var steps = await getSteps();
        this.setState({ seasons: seasons, teams: teams, steps: steps, season: activeSeason.year });
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

        return (
            <div>
                <Form>
                    <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleControlChange} />
                    <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleControlChange} />
                    <TeamSelect controlId="selectHomeTeam" name="homeTeamId" label="Equipa Visitada"
                        teams={this.state.teams} value={homeTeamId} 
                        onChange={this.handleControlChange} />
                    <TeamSelect controlId="selectAwayTeam" name="awayTeamId" label="Equipa Visitante"
                        teams={this.state.teams} value={awayTeamId} 
                        onChange={this.handleControlChange} />
                    <Button bsStyle="primary" type="submit" onClick={this.handleSubmit} disabled={this.state.loading}>Gerar</Button>
                    <span style={{ display: this.state.loading ? 'inline' : 'none' }}><img src="/show_loader.gif" alt="" style={{ height: '40px', width: '40px' }} /></span>

                    {this.state.exportDataUrl ?
                        <a href={this.state.exportDataUrl} download="ficha_jogo.pdf" target="_blank" rel="noopener noreferrer">Download</a>
                        : ''}
                </Form>
            </div>);
    }
}