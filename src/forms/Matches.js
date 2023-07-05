import React, { Component, Fragment } from 'react';
import { Form, Button } from 'react-bootstrap';
import Table from '../components/Table';
import { SeasonSelect, StepSelect, PhaseSelect } from '../components/Controls';
import { getSeasons, getSteps, getPhases, getMatches, removeMatch } from '../utils/communications';

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
            phaseId: 0
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
                            this.setState({ matches: matches });
                        } else {
                            alert('Nenhum jogo encontrado.');
                            this.setState({ matches: [] });
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
        const { season, stepId, phaseId, matches } = this.state;

        return (
            <Form inline>
                <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange} />
                <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleStepChange} />
                <PhaseSelect phases={this.state.phases} value={phaseId} onChange={this.handlePhaseChange} />
                <TableMatches year={season} step={stepId} phase={phaseId} matches={matches} isAdmin={this.props.isAdmin} />
            </Form>
        );
    }
}

function TableMatches(props) {
    const { year, step, phase, matches, isAdmin } = props;

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
        if (window.confirm('Tem a certeza que quer remover o jogo?')) {
            await removeMatch(year, step, id);

            // var matches = await getMatches(year, step);
            // this.setState({ matches: matches });
        }
    }

    if (matches && matches.length > 0) {
        var columns = [
            { Header: 'Fase', id: 'phase', accessor: 'phase' },
            { Header: 'Equipa Visitada', id: 'homeTeam', accessor: 'homeTeamName' },
            { Header: 'Golos', id: 'homeTeamGoals', accessor: 'homeTeamGoals' },
            { Header: "Equipa Visitante", id: "awayTeam", accessor: "awayTeamName" },
            { Header: "Golos", id: "awayTeamGoals", accessor: "awayTeamGoals" }
        ];

        if (isAdmin) {
            columns.push({ Header: "", id: "id", accessor: 'matchId', Cell: (row) => matchActions(row.original) });
        }
        return (
            <div>
                <Table
                    columns={columns}
                    data={matches} />
            </div>
        );
    }
    return '';
}