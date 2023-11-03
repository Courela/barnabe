import React, { Component, Fragment } from 'react';
import { Form, Button } from 'react-bootstrap';
import Table from '../components/Table';
import { SeasonSelect, StepSelect, PhaseSelect, Select } from '../components/Controls';
import { getSeasons, getSteps, getPhases, getMatches, removeMatch } from '../utils/communications';
import localization from '../localization';
import { groupBy } from '../utils/common';

export default class Matches extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seasons: [],
            steps: [],
            phases: [],
            matches: [],
            season: 0,
            stepId: 0,
            phaseId: 0,
            group: -1,
        }

        this.handleSeasonChange = this.handleSeasonChange.bind(this);
        this.handleStepChange = this.handleStepChange.bind(this);
        this.handlePhaseChange = this.handlePhaseChange.bind(this);
        this.handleControlChange = this.handleControlChange.bind(this);
    }

    async componentDidMount() {
        if (!this.state.seasons.length) {
            var seasons = await getSeasons();
            var season = seasons.find(s => s.is_active);
            this.setState({ seasons: seasons, season: season.year });
        }
        if (!this.state.steps.length) {
            var steps = await getSteps();
            this.setState({ steps: steps });
        }
        if (!this.state.phases.length) {
            var phases = await getPhases();
            phases.push({ id: 99, description: "Todos" });
            this.setState({ phases: phases });
        }
    }

    handleSeasonChange(evt) {
        this.setState({ phaseId:0, stepId: 0, matches: [] });
        const season = evt.target.value;
        getSteps(season, null)
            .then(r => {
                if (r) {
                    this.setState({ steps: r });
                }
            });

        this.handleControlChange(evt);
        if(evt) { evt.preventDefault(); }
    }

    handleStepChange(evt) {
        this.handleControlChange(evt);
        this.setState({ phaseId: 0, matches: [] });
    }

    handlePhaseChange(evt) {
        var fn = (season, stepId, phaseId) => {
            if (season && stepId && phaseId) {
                getMatches(season, stepId, phaseId)
                    .then(matches => {
                        if (matches && matches.length > 0) {
                            this.setState({ matches: matches, group: -1 });
                        } else {
                            alert(localization.MSG_000);
                            this.setState({ matches: [], group: -1 });
                        }
                    });
            } else {
                console.warn('Not every search param filled: ', season, stepId, phaseId);
            }
        };
        this.handleControlChange(evt, fn);
    }

    handleControlChange(evt, fn) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal }, () => fn ? fn(this.state.season, this.state.stepId, this.state.phaseId) : null);
    }

    render() {
        const { season, stepId, phaseId, matches, group } = this.state;
        let filteredMatches = !group || group <= 0 ? matches : matches.filter(m => m.group == group);
        return (
            <Form inline>
                <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange} />
                <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleStepChange} />
                <PhaseSelect phases={this.state.phases} value={phaseId} onChange={this.handlePhaseChange} />
                <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                    <GroupSelect matches={matches} group={this.state.group} onChange={this.handleControlChange} />
                </div>
                <TableMatches year={season} step={stepId} phase={phaseId}
                    matches={filteredMatches} isAdmin={this.props.isAdmin} defaultSorted={[{ id: "date", desc: false }]}/>
            </Form>
        );
    }
}

function GroupSelect(props) {
    let groupedByGroup = groupBy(props.matches, 'group');
    let groups = Object.keys(groupedByGroup).map(g => { return { value: g === 'null' ? -1 : g, description: g === 'null' ? localization.OPT_001 : g }; });
    if (groups && groups.length > 1) {
        return <Select controlId="selectGroup" name="group" label="Grupo" 
            options={groups} value={props.group}
            onChange={props.onChange} />;
    } else {
        return '';
    }
}

function TableMatches(props) {
    const { year, step, matches, isAdmin, defaultSorted } = props;

    var matchActions = (row) => {
        const { matchId } = row;
        if (isAdmin) {
            const removeFn = () => removeMatch(year, step, matchId);
            return (
                <Fragment>
                    <Button bsStyle="link" bsSize="small" onClick={removeFn}>Remover</Button>
                </Fragment>
            );
        }
        else return ('');
    }

    var removeMatch = async (year, step, id) => {
        if (window.confirm(localization.MSG_001)) {
            await removeMatch(year, step, id);

            // var matches = await getMatches(year, step);
            // this.setState({ matches: matches });
        }
    }

    if (matches && matches.length > 0) {
        var columns = [
            { Header: localization.HDR_001, id: 'date', accessor: 'date' },
            { Header: localization.HDR_002, id: 'phase', accessor: 'phase' },
            { Header: localization.HDR_006, id: 'group', accessor: 'group' },
            { Header: localization.HDR_007, id: 'matchday', accessor: 'matchday' },
            { Header: localization.HDR_003, id: 'homeTeam', accessor: 'homeTeamName' },
            { Header: localization.HDR_004, id: 'homeTeamGoals', accessor: 'homeTeamGoals', sortable: false },
            { Header: localization.HDR_005, id: "awayTeam", accessor: "awayTeamName" },
            { Header: localization.HDR_004, id: "awayTeamGoals", accessor: "awayTeamGoals", sortable: false }
        ];

        if (isAdmin) {
            columns.push({ Header: "", id: "id", accessor: 'matchId', Cell: (row) => matchActions(row.original) });
        }
        return (
            <div>
                <Table
                    columns={columns}
                    data={matches} 
                    defaultSorted={defaultSorted} />
            </div>
        );
    }
    return '';
}