import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import Table from '../components/Table';
import { SeasonSelect, StepSelect } from '../components/Controls';
import { getSeasons, getSteps, getStandings } from '../utils/communications';

export default class Standings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seasons: [],
            steps: [],
            season: 0,
            stepId: 0
        };

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
                    <TableStandings year={this.state.season} step={this.state.stepId} /> :
                    "" }
            </Form>
        );
    }
}

class TableStandings extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            standings: []
        };
    }

    async componentDidMount() {
        const { year, step } = this.props;
        var standings = await getStandings(year, step);
        this.setState({ standings: standings });
    }

    render() {
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
                    data={this.state.standings} />
            </div>
        );
    }
}