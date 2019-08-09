import React, { Component } from 'react';
import Table from '../../components/Table';
import {  Button, Tabs, Tab } from 'react-bootstrap';
import { SeasonSelect, TeamSelect, StepSelect } from '../../components/Controls';
import { getTeams, getTeamSteps, getSteps, getSeasons } from '../../utils/communications';

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

        this.getSeasons = this.getSeasons.bind(this);
        this.getFilteredSteps = this.getFilteredSteps.bind(this);
        this.getFilteredTeams = this.getFilteredTeams.bind(this);
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
        getTeamSteps(this.state.season, this.state.teamId)
            .then(result => {
                this.setState({ data: result.data });
            })
            .catch(errors.handleError);
    }

    getFilteredTeams() {
        getStepsForTeam(this.state.season, this.state.teamId)
            .then(result => {
                this.setState({ data: result.data });
            })
            .catch(errors.handleError);
    }

    render() {
        const { season, teamId, stepId } = this.state;

        return (
            <div>
                <Tabs>
                    <Tab eventKey={1} title="Escalões">
                        <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange.bind(this)} />
                        <TeamSelect teams={this.state.teams} value={teamId} onChange={this.handleTeamChange.bind(this)} />
                        <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Procurar</Button>
                        <div>
                            <Table
                                columns={[
                                    { Header: 'Escalão', id: 'id', accessor: 'Description' }
                                ]}
                                data={this.state.stepsData}
                                onFetchData={this.getFilteredSteps}  />
                        </div>
                    </Tab>
                    <Tab eventKey={2} title="Colectividades">
                        <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange.bind(this)} />
                        <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleControlChange} />
                        <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Procurar</Button>
                        <div>
                            <Table
                                columns={[
                                    { Header: 'Colectividade', id: 'id', accessor: 'Name' }
                                ]}
                                data={this.state.teamsData}
                                onFetchData={this.getFilteredTeams}  />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
