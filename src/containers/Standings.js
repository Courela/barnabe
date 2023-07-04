import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import Table from '../components/Table';
import { SeasonSelect, StepSelect, PhaseSelect } from '../components/Controls';
import { getSeasons, getSteps, getStandings, getPhases } from '../utils/communications';

export default class Standings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seasons: [],
            steps: [],
            phases: [],
            standings: [],
            season: 0,
            stepId: 0,
            phaseId: 0
        };

        this.handleSeasonChange = this.handleSeasonChange.bind(this);
        this.handleStepChange = this.handleStepChange.bind(this);
        this.handlePhaseChange = this.handlePhaseChange.bind(this);
        this.handleControlChange = this.handleControlChange.bind(this);
        
        this.getSeasons = this.getSeasons.bind(this);
    }

    async componentDidMount() {
        await this.getSeasons();
        var steps = await getSteps();
        this.setState({ steps: steps });

        if (!this.state.phases.length) {
            var phases = await getPhases();
            this.setState({ phases: phases });
        }
    }

    async getSeasons() {
        var seasons = await getSeasons();
        var season = seasons.find(s => s.is_active);
        this.setState({ seasons: seasons, season: season.year });
    }

    handleSeasonChange(evt) {
        this.handleControlChange(evt);
        if(evt) { evt.preventDefault(); }
    }

    handleStepChange(evt) {
        this.handleControlChange(evt);
        this.setState({ phaseId: 0 });
    }

    handlePhaseChange(evt) {
        var fn = () => {
            if (this.state.season && this.state.stepId && this.state.phaseId) {
                getStandings(this.state.season, this.state.stepId, this.state.phaseId)
                    .then(standings => {
                        if (standings) {
                            this.setState({ standings: standings });
                        }
                    });
            }
        };
        this.handleControlChange(evt, fn);
    }

    handleControlChange(evt, fn) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal }, fn);
    }

    render() {
        const { season, stepId, phaseId, standings } = this.state;

        return (
            <Form inline>
                <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange.bind(this)} />
                <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleStepChange} />
                <PhaseSelect phases={this.state.phases} value={phaseId} onChange={this.handlePhaseChange} />
                <TableStandings standings={standings} />
            </Form>
        );
    }
}

function TableStandings(props) {
    const { standings } = props;

    if (standings && standings.length > 0) {
        return (
            <div>
                <Table
                    columns={[
                        { Header: 'Pos', id: 'pos', accessor: 'position' },
                        { Header: 'Equipa', id: 'team', accessor: 'teamName' },
                        { Header: 'Pontos', id: 'points', accessor: 'points' },
                        { Header: "GM", id: "gs", accessor: "goalsScored" },
                        { Header: "GS", id: "gc", accessor: "goalsConceded" },
                        { Header: "Avg", id: "avg", accessor: "avg" },
                    ]}
                    data={standings} />
            </div>
        );
    }

    return '';
}