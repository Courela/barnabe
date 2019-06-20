import React from 'react';
import ReactTable from 'react-table';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import queryString from 'query-string';
import settings from '../settings';
import errors from '../components/Errors';
import { dateFormat } from '../utils/formats';
import { getSeasons, getStep, getPlayers, copyPlayers, getStaff } from '../utils/communications';

export default class Import extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            season: props.match.params.year,
            stepId: props.match.params.stepId,
            teamId: props.teamId,
            role: props.location.search ? queryString.parse(props.location.search).role : null,
            seasons: [],
            selectedSeason: 0,
            //selected: {},
            selected: [],
            selectAll: 0,
            players: [],
            step: null,
            isSubmitting: false
        };

        this.toggleRow = this.toggleRow.bind(this);
        this.getPlayers = this.getPlayers.bind(this);
        this.handleSeasonSelect = this.handleSeasonSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isPlayerEligible = this.isPlayerEligible.bind(this);
    }

    async componentDidMount() {
        var step = this.state.step;
        if (!step) {
            step = await getStep(this.state.stepId, this.state.season)
                .then(result => result.data)
                .catch(errors.handleError);
        }

        var seasons = this.state.seasons;
        if (this.state.seasons.length === 0) {
            seasons = await getSeasons()
                .then((result) => {
                    if (result.data && result.data.length > 0) {
                        return result.data.filter((v,i,arr) => v.Year < this.state.season);
                    }
                })
                .catch(errors.handleError);
        }

        this.setState({ step: step, seasons: seasons });
    }

    getPlayers() {
        if (this.state.players.length === 0) {
            const { selectedSeason, teamId, stepId, role } = this.state;
            console.log('Role: ', role);
            (role === 'staff' ? 
                getStaff(selectedSeason, teamId, stepId) :
                getPlayers(selectedSeason, teamId, stepId))
                .then(result => {
                    //console.log(result);
                    if (result.data && result.data.length > 0) {
                        this.setState({ players: result.data });
                    }
                })
                .catch(errors.handleError);
        }
    }

    handleSeasonSelect(evt) {
        this.setState({ selectedSeason: evt.target.value }, () => this.getPlayers());
    }

    validateSeason() {
        if (this.state.selectedSeason <= 0) return 'error';
        return null;
    }

    handleSubmit(evt) {
        console.log('Selected: ', this.state.selected);
        const { season, teamId, stepId, role } = this.state;
        copyPlayers(season, teamId, stepId, this.state.selectedSeason, this.state.selected)
            .then(result => {
                console.log(result);
                alert((role === 'staff' ? 'Membros da Equipa Técnica': 'Jogadores' ) + ' importados com sucesso.');
                this.props.history.push('/seasons/' + season + '/steps/' + stepId);
            })
            .catch((err) => {
                errors.handleError(err);
                this.setState({ isSubmitting: false });
            });
        evt.preventDefault();
    }

    toggleRow(Id) {
        let newSelected = this.state.selected.slice();
        const index = this.state.selected.indexOf(Id);
        if (index < 0) {
            newSelected.push(Id);
        }
        else 
        {
            newSelected.splice(index, 1);
        }
        this.setState({ selected: newSelected, selectAll: 2 });

        // const newSelected = Object.assign({}, this.state.selected);
        // newSelected[Id] = !this.state.selected[Id];
        // this.setState({
        //     selected: newSelected,
        //     selectAll: 2
        // });
    }

    toggleSelectAll() {
        let newSelected = [];

        if (this.state.selectAll === 0) {
            this.state.players.forEach(x => {
                if (this.isPlayerEligible(x)) {
                    newSelected.push(x.Id);
                }
            });
        }

        this.setState({
            selected: newSelected,
            selectAll: this.state.selectAll === 0 ? 1 : 0
        });
    }

    isPlayerEligible(player) {
        return this.state.role === 'staff' || player.person.Birthdate >= this.state.step.MinDate;
    }

    render() {
        const columns = [
            {
                id: "checkbox",
                accessor: "",
                Cell: ({ original }) => {
                    return (this.isPlayerEligible(original) ? 
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={this.state.selected.indexOf(original.Id) >= 0}
                            onChange={() => this.toggleRow(original.Id)}
                        /> : <span />
                    );
                },
                Header: x => {
                    return (
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={this.state.selectAll === 1}
                            ref={input => {
                                if (input) {
                                    input.indeterminate = this.state.selectAll === 2;
                                }
                            }}
                            onChange={() => this.toggleSelectAll()}
                        />
                    );
                },
                sortable: false,
                width: 45
            },
            {
                Header: "Nome",
                accessor: "person.Name"
            },
            {
                Header: "Data Nascimento",
                id: "birthdate", 
                accessor: "person.Birthdate",
                Cell: (row) => dateFormat(row.original.person.Birthdate)
            },
            {
                Header: "Cartão Cidadão",
                accessor: "person.IdCardNr"
            }
        ];

        const selectSeasons = this.state.seasons.map((s, idx) => <option key={idx} value={s.Year}>{s.Year}</option>);

        return (
            <div>
                <h1>Importar Jogadores - {this.state.step ? this.state.step.Description : ''}</h1>
                <FormGroup controlId="selectSeason" validationState={this.validateSeason()}>
                    <ControlLabel>Época</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                        onChange={this.handleSeasonSelect}>
                        <option value="0">Escolha...</option>
                        {selectSeasons}
                    </FormControl>
                    <FormControl.Feedback />
                </FormGroup>
                <ReactTable
                    data={this.state.players}
                    columns={columns}
                    defaultSorted={[{ id: "Id", desc: false }]}
                    minRows={Math.max(Math.min(this.state.players.length, settings.DEFAULT_TABLE_PAGE_SIZE), 1)}
                    defaultPageSize={settings.DEFAULT_TABLE_PAGE_SIZE}
                />
                <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}
                    disabled={this.state.isSubmitting}>
                    Importar
                </Button>
                <span style={{ display: this.state.isSubmitting ? 'inline' : 'none' }}><img src="/show_loader.gif" alt="" style={{ height: '40px', width: '40px' }} /></span>
            </div>
        );
    }
}
