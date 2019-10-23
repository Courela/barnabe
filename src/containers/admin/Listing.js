import React, { Component } from 'react';
import Table from '../../components/Table';
import {  Button, Tabs, Tab } from 'react-bootstrap';
import { SeasonSelect, TeamSelect, StepSelect } from '../../components/Controls';
import { getTeams, getTeamSteps, getSteps, getSeasons, getTeamsByStep } from '../../utils/communications';
import errors from '../../components/Errors';

export default class Listing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seasons: [],
            teams: [],
            steps: [],
            season: 0,
            teamId: 0,
            stepId: 0,
            teamsData: [],
            stepsData: []
        };

        this.getFilteredSteps = this.getFilteredSteps.bind(this);
        this.getFilteredTeams = this.getFilteredTeams.bind(this);
        this.handleControlChange = this.handleControlChange.bind(this);
    }

    async componentDidMount() {
        await this.getSeasons();
        //this.getSteps();
        //this.fillSearchCriteria(this.props);
    }

    async getSeasons() {
        var seasons = await getSeasons().then(results => results.data);
        var teams = await getTeams().then(results => results.data);
        var steps = await getSteps().then(results => results.data);
        this.setState({ seasons: seasons, teams: teams, steps: steps });
    }

    getFilteredSteps() {
        var { season, teamId } = this.state;
        if (season > 0 && teamId > 0) {
            getTeamSteps(season, teamId)
                .then(result => {
                    this.setState({ stepsData: result.data });
                })
                .catch(errors.handleError);
        }
    }

    getFilteredTeams() {
        var { season, stepId } = this.state;
        if (season > 0 && stepId > 0) {
            getTeamsByStep(season, stepId)
                .then(result => {
                    this.setState({ teamsData: result.data });
                })
                .catch(errors.handleError);
        }
    }

    handleSeasonChange(evt) {
        const season = evt.target.value;
        const { teamId, stepId } = this.state;
        if (season && teamId) {
            this.getFilteredSteps(season, teamId);
        } else if (season && stepId) {
            this.getFilteredTeams(season, stepId);
        }

        this.handleControlChange(evt);

        if(evt) { evt.preventDefault(); }
    }

    handleTeamChange(evt) {
        const teamId = evt.target.value;
        const { season, stepId } = this.state;
        if (season && teamId) {
            this.getFilteredSteps(season, teamId);
        } else if (season && stepId) {
            this.getFilteredTeams(season, stepId);
        }

        this.handleControlChange(evt);

        if(evt) { evt.preventDefault(); }
    }

    handleControlChange(evt) {
        //console.log(evt);
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    render() {
        const { season, teamId, stepId } = this.state;

        return (
            <div>
                <Tabs id='listingTabs'>
                    <Tab eventKey={2} title="Colectividades">
                        <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange.bind(this)} />
                        <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleControlChange} />
                        <Button bsStyle="primary" type="submit" onClick={this.getFilteredTeams}>Procurar</Button>
                        <div>
                            <Table
                                columns={[
                                    { Header: 'Colectividade', id: 'id', accessor: 'ShortDescription' }
                                ]}
                                data={this.state.teamsData}
                                onFetchData={this.getFilteredTeams}  />
                        </div>
                    </Tab>
                    <Tab eventKey={1} title="Escalões">
                        <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange.bind(this)} />
                        <TeamSelect teams={this.state.teams} value={teamId} onChange={this.handleTeamChange.bind(this)} />
                        <Button bsStyle="primary" type="submit" onClick={this.getFilteredSteps}>Procurar</Button>
                        <div>
                            <Table
                                columns={[
                                    { Header: 'Escalão', id: 'id', accessor: 'Description' }
                                ]}
                                data={this.state.stepsData}
                                onFetchData={this.getFilteredSteps}  />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
