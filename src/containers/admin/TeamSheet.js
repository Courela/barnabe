import React, { Component } from 'react';
import queryString from 'query-string';
import { Button, Form } from 'react-bootstrap';
//import atob from 'atob';
import { SeasonSelect, TeamSelect, StepSelect } from '../../components/Controls';
import errors from '../../components/Errors';
import { getSeasons, getTeams, getTeamSteps, getTeamTemplate } from '../../utils/communications';

export default class TeamSheet extends Component {
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
            exportDataUrl: null,
            loading: false
        };

        this.handleControlChange = this.handleControlChange.bind(this);
        this.getFilters = this.getFilters.bind(this);
        //this.getSteps = this.getSteps.bind(this);
        this.fillSearchCriteria = this.fillSearchCriteria.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
    }

    async componentDidMount() {
        await this.getFilters();
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
                season: parseInt(season, 10),
                teamId: parseInt(teamId, 10),
                stepId: parseInt(stepId, 10)
            }, () => this.fetchResults());
        }
    }

    async getFilters() {
        var seasons = await getSeasons().then(results => results.data);
        var teams = await getTeams().then(results => results.data);
        var activeSeason = seasons.find(s => s.IsActive);
        this.setState({ seasons: seasons, teams: teams, season: activeSeason.Year });
    }

    handleSeasonChange(evt) {
        const season = evt.target.value;
        const { teamId } = this.state;
        if (season && teamId) {
            getTeamSteps(season, teamId)
                .then(result => {
                    this.setState({ steps: result.data, stepId: 0, data: [], exportDataUrl: null });
                })
                .catch(errors.handleError);
        }

        this.handleControlChange(evt);

        if(evt) { evt.preventDefault(); }
    }

    handleTeamChange(evt) {
        const teamId = evt.target.value;
        const { season } = this.state;
        if (season && teamId) {
            getTeamSteps(season, teamId)
                .then(result => {
                    this.setState({ steps: result.data, stepId: 0, data: [], exportDataUrl: null });
                })
                .catch(errors.handleError);
        }

        this.handleControlChange(evt);

        if (evt) { evt.preventDefault(); }
    }

    handleControlChange(evt) {
        //console.log(evt);
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal, exportDataUrl: null });
    }

    handleSubmit(evt) {
        const { season, teamId, stepId } = this.state;
        if (season > 0 && teamId > 0 && stepId > 0) {
            this.props.history.push(this.props.location.pathname + '?season=' + season + '&teamId=' + teamId + '&stepId=' + stepId);
        }
        else {
            alert('Escolha todos os critérios de pesquisa.');
        }

        if (evt) { evt.preventDefault(); }
    }

    fetchResults() {
        this.setState({ loading: true }, () => {
            const { season, teamId, stepId } = this.state;
            getTeamTemplate(season, teamId, stepId)
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
        const { season, teamId, stepId } = this.state;

        return (
            <div>
                <Form>
                    <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange.bind(this)} />
                    <TeamSelect teams={this.state.teams} value={teamId} onChange={this.handleTeamChange.bind(this)} />
                    <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleControlChange} />
                    <Button bsStyle="primary" type="submit" onClick={this.handleSubmit} disabled={this.state.loading}>Gerar</Button>
                    <span style={{ display: this.state.loading ? 'inline' : 'none' }}><img src="/show_loader.gif" alt="" style={{ height: '40px', width: '40px' }} /></span>

                    {this.state.exportDataUrl ?
                        <a href={this.state.exportDataUrl} download="ficha_equipa.pdf" target="_blank" rel="noopener noreferrer">Download</a>
                        : ''}
                </Form>
            </div>);
    }
}