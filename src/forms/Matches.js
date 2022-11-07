import React, { Component, Fragment } from 'react';
import { Form, Button } from 'react-bootstrap';
import Table from '../components/Table';
import { SeasonSelect, StepSelect } from '../components/Controls';
import { getSeasons, getSteps, getMatches, removeMatch } from '../utils/communications';

export default class Matches extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seasons: [],
            steps: [],
            season: 0,
            stepId: 0
        }

        this.handleControlChange = this.handleControlChange.bind(this);
        this.getSeasons = this.getSeasons.bind(this);
    }

    async componentDidMount() {
        await this.getSeasons();
        var steps = await getSteps();
        this.setState({ steps: steps });
    }

    async getSeasons() {
        var seasons = await getSeasons();
        var season = seasons.find(s => s.is_active);
        this.setState({ seasons: seasons, season: season.year });
    }

    handleSeasonChange(evt) {
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

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    render() {
        const { season, stepId } = this.state;

        return (
            <Form inline>
                <SeasonSelect seasons={this.state.seasons} value={season} onChange={this.handleSeasonChange.bind(this)} />
                <StepSelect steps={this.state.steps} value={stepId} onChange={this.handleControlChange} />
                { this.state.stepId > 0 ?
                    <TableMatches year={this.state.season} step={this.state.stepId} isAdmin={this.props.isAdmin} /> :
                    "" }
            </Form>
        );
    }
}

class TableMatches extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            matches: []
        };

        this.playerActions = this.matchActions.bind(this);
        this.matchActions = this.matchActions.bind(this);
    }

    async componentDidMount() {
        const { year, step } = this.props;
        var matches = await getMatches(year, step);
        if (matches) {
            this.setState({ matches: matches });
        }
    }
    
    matchActions(row) {
        const { year, step } = this.props;
        const { matchId } = row;
        if (this.props.isAdmin) {
            const removeFn = () => this.removeMatch(year, step, matchId);
            return (
                <Fragment>
                    <Button bsStyle="link" bsSize="small" onClick={removeFn}>Remover</Button>
                </Fragment>
            );
        }
        else return ('');
    }

    async removeMatch(year, step, id) {
        if (window.confirm('Tem a certeza que quer remover o jogo?')) {
            await removeMatch(year, step, id);

            var matches = await getMatches(year, step);
            this.setState({ matches: matches });
        }
    }

    render() {
        var columns = [
            { Header: 'Fase', id: 'phase', accessor: 'phase' },
            { Header: 'Equipa Visitada', id: 'homeTeam', accessor: 'homeTeamName' },
            { Header: 'Golos', id: 'homeTeamGoals', accessor: 'homeTeamGoals' },
            { Header: "Equipa Visitante", id: "awayTeam", accessor: "awayTeamName" },
            { Header: "Golos", id: "awayTeamGoals", accessor: "awayTeamGoals" }
        ];

        if (this.props.isAdmin) {
            columns.push({ Header: "", id: "id", accessor: 'matchId', Cell: (row) => this.matchActions(row.original) });
        }
        return (
            <div>
                <Table
                    columns={columns}
                    data={this.state.matches} />
            </div>
        );
    }
}