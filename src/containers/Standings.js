import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import Table from '../components/Table';
import { SeasonSelect, StepSelect, PhaseSelect, Select } from '../components/Controls';
import { getSeasons, getSteps, getStandings, getPhases } from '../utils/communications';
import localization from '../localization';
import { groupBy } from '../utils/common';

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
            phaseId: 0,
            group: -1,
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
        this.setState({ phaseId: 0, stepId: 0, standings: [] });
        if(evt) { evt.preventDefault(); }
    }

    handleStepChange(evt) {
        this.handleControlChange(evt);
        this.setState({ phaseId: 0, standings: [] });
    }

    handlePhaseChange(evt) {
        var fn = () => {
            if (this.state.season && this.state.stepId && this.state.phaseId) {
                getStandings(this.state.season, this.state.stepId, this.state.phaseId)
                    .then(standings => {
                        if (standings && standings.length > 0) {
                            this.setState({ standings: standings });
                        } else {
                            alert('Nenhuma classificação encontrada.');
                            this.setState({ standings: [] });
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
        const { season, stepId, phaseId, standings, group } = this.state;
        let filteredStanding = !group || group <= 0 ? standings : standings.filter(m => m.group == group);

        return (
            <Form inline>
                <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange.bind(this)} />
                <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleStepChange} />
                <PhaseSelect phases={this.state.phases} value={phaseId} onChange={this.handlePhaseChange} />
                <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                    <GroupSelect standings={standings} group={this.state.group} onChange={this.handleControlChange} />
                </div>
                <TableStandings standings={filteredStanding} />
            </Form>
        );
    }
}

function GroupSelect(props) {
    let groupedByGroup = groupBy(props.standings, 'group');
    let groups = Object.keys(groupedByGroup).map(g => { return { value: g === 'null' ? -1 : g, description: g === 'null' ? localization.OPT_001 : g }; });
    if (groups && groups.length > 1) {
        return <Select controlId="selectGroup" name="group" label="Grupo" 
            options={groups} value={props.group}
            onChange={props.onChange} />;
    } else {
        return '';
    }
}

function TableStandings(props) {
    const { standings } = props;

    if (standings && standings.length > 0) {
        return (
            <div>
                <Table
                    columns={[
                        //{ Header: 'Pos', id: 'pos', accessor: 'position' },
                        { Header: 'Equipa', id: 'team', accessor: 'teamName' },
                        { Header: 'Pontos', id: 'points', accessor: 'points' },
                        { Header: 'Jogos', id: 'played', accessor: 'played' },
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