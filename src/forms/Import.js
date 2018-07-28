import React from 'react';
import ReactTable from 'react-table';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import axios from 'axios';
import settings from '../settings';
import errors from '../components/Errors';
import { dateFormat } from '../utils/formats';

export default class Import extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            season: props.match.params.year,
            stepId: props.match.params.stepId,
            teamId: props.teamId,
            seasons: [2017],
            selectedSeason: 0,
            //selected: {},
            selected: [],
            selectAll: 0,
            players: [],
            stepName: null,
            isSubmitting: false
        };

        this.toggleRow = this.toggleRow.bind(this);
        this.getPlayers = this.getPlayers.bind(this);
        this.handleSeasonSelect = this.handleSeasonSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (!this.state.stepName) {
            axios.get(settings.API_URL + '/api/steps/' + this.state.stepId)
                .then(result => {
                    //console.log(result);
                    if (result.data) {
                        this.setState({ stepName: result.data.Description });
                    }
                })
                .catch(errors.handleError);
        }
    }

    getPlayers() {
        if (this.state.players.length === 0) {
            const { selectedSeason, teamId, stepId } = this.state;
            axios.get(settings.API_URL + '/api/seasons/' + selectedSeason + '/teams/' + teamId + '/steps/' + stepId + '/players')
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
        const { season, teamId, stepId } = this.state;
        const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/import-players';
        const data = {
            selectedSeason: this.state.selectedSeason,
            playerIds: this.state.selected
        }
        axios.post(url, data)
            .then(result => {
                console.log(result);
                alert('Jogadores importados com sucesso.');
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
                newSelected.push(x.Id);
            });
        }

        this.setState({
            selected: newSelected,
            selectAll: this.state.selectAll === 0 ? 1 : 0
        });
    }

    render() {
        const columns = [
            {
                id: "checkbox",
                accessor: "",
                Cell: ({ original }) => {
                    return (
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={this.state.selected.indexOf(original.Id) >= 0}
                            onChange={() => this.toggleRow(original.Id)}
                        />
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
                accessor: "Name"
            },
            {
                Header: "Data Nascimento",
                id: "Id",
                Cell: (row) => dateFormat(row.original.Birthdate)
            },
            {
                Header: "Cartão Cidadão",
                accessor: "IdCardNr"
            }
        ];

        const selectSeasons = this.state.seasons.map((s, idx) => <option key={idx} value={s}>{s}</option>);

        return (
            <div>
                <h1>Importar Jogadores - {this.state.stepName}</h1>
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
