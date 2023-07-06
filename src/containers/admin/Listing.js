import React, { Component } from 'react';
import Table from '../../components/Table';
import { Tabs, Tab } from 'react-bootstrap';
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
    }

    async getSeasons() {
        var seasons = await getSeasons();
        var teams = await getTeams();
        var steps = await getSteps();
        this.setState({ seasons: seasons, teams: teams, steps: steps });
    }

    getFilteredSteps(season, teamId) {
        if (season > 0 && teamId > 0) {
            getTeamSteps(season, teamId)
                .then(result => {
                    this.setState({ stepsData: result });
                })
                .catch(errors.handleError);
        }
    }

    getFilteredTeams(season, stepId) {
        if (season > 0 && stepId > 0) {
            getTeamsByStep(season, stepId)
                .then(result => {
                    this.setState({ teamsData: result });
                })
                .catch(errors.handleError);
        }
    }

    handleSeasonChange(evt) {
        this.setState({ teamsData: [], stepsData: [], teamId: 0, stepId: 0 });
        this.handleControlChange(evt);
    }

    handleStepChange(evt) {
        var fn = (state) => {
            const { season, stepId } = state;
            if (season && stepId) {
                this.getFilteredTeams(season, stepId);
            }
        };

        this.handleControlChange(evt, fn);
    }

    handleTeamChange(evt) {
        var fn = (state) => {
            const { season, teamId } = state;
            if (season && teamId) {
                this.getFilteredSteps(season, teamId);
            }
        };

        this.handleControlChange(evt, fn);
    }

    handleControlChange(evt, fn) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal }, () => fn ? fn(this.state) : null);
    }

    render() {
        const { season, teamId, stepId } = this.state;

        return (
            <div>
                <Tabs id='listingTabs' onSelect={() => this.setState({ season: 0, teamId: 0, stepId: 0, teamsData: [], stepsData: [] })}>
                    <Tab eventKey={2} title="Colectividades">
                        <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange.bind(this)} />
                        <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleStepChange.bind(this)} />
                        <div>
                            <Table
                                columns={[
                                    { Header: 'Colectividade', id: 'id', accessor: 'short_description' }
                                ]}
                                data={this.state.teamsData} />
                        </div>
                    </Tab>
                    <Tab eventKey={1} title="Escalões">
                        <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange.bind(this)} />
                        <TeamSelect teams={this.state.teams} value={teamId} onChange={this.handleTeamChange.bind(this)} />
                        <div>
                            <Table
                                columns={[
                                    { Header: 'Escalão', id: 'id', accessor: 'description' }
                                ]}
                                data={this.state.stepsData}  />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
