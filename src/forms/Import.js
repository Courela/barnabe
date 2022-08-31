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
            step = await getStep(this.state.stepId, this.state.season);
        }

        var seasons = this.state.seasons;
        if (this.state.seasons.length === 0) {
            seasons = await getSeasons()
                .then((r) => {
                    if (r.length > 0) {
                        return r.filter((v,i,arr) => v.year < this.state.season);
                    }
                })
                .catch(errors.handleError);
        }

        this.setState({ step: step, seasons: seasons });
    }

    getPlayers() {
        const { selectedSeason, teamId, stepId, role } = this.state;
        (role === 'staff' ? 
            getStaff(selectedSeason, teamId, stepId) :
            getPlayers(selectedSeason, teamId, stepId))
            .then(result => {
                var previousStepId = this.getPreviousStep(stepId);
                if (previousStepId > 0) {
                    getPlayers(selectedSeason, teamId, previousStepId.toString())
                    .then(r => {  
                        this.setState({ players: r.concat(result) });
                    })
                    .catch(errors.handleError);
                } else {
                    this.setState({ players: result });
                    // alert("Encontradas " + result.length + " pessoas.");
                }
            })
            .catch(errors.handleError);
    }

    getPreviousStep(stepId) {
        var s = parseInt(stepId, 10);
        var result = 0;
        if (s === 1) {
            result = 4;
        } else if (s < 4) {
            result = s - 1;
        }
        return result;
    }

    handleSeasonSelect(evt) {
        this.setState({ selectedSeason: evt.target.value }, () => this.getPlayers());
    }

    validateSeason() {
        if (this.state.selectedSeason <= 0) return 'error';
        return null;
    }

    handleSubmit(evt) {
        const { season, teamId, stepId, role } = this.state;
        if (this.state.selected && this.state.selected.length > 0) {
            copyPlayers(season, teamId, stepId, this.state.selectedSeason, this.state.selected)
                .then(result => {
                    var count = result && result.Imported ? result.Imported : 0;
                    alert(count + (role === 'staff' ? ' membro(s) da Equipa Técnica': ' jogador(es)' ) + ' importado(s) com sucesso.');
                    this.props.history.push('/seasons/' + season + '/steps/' + stepId);
                })
                .catch((err) => {
                    errors.handleError(err);
                    this.setState({ isSubmitting: false });
                });
        }
        else {
            alert("Nenhum jogador seleccionado.");
        }
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
        return this.state.role === 'staff' || player.person.birthdate >= this.state.step.min_date;
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
                            checked={this.state.selected.indexOf(original.id) >= 0}
                            onChange={() => this.toggleRow(original.id)}
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
                accessor: "person.name"
            },
            {
                Header: "Data Nascimento",
                id: "birthdate", 
                accessor: "person.birthdate",
                Cell: (row) => dateFormat(row.original.person.birthdate)
            },
            {
                Header: "Cartão Cidadão",
                accessor: "person.id_card_number"
            }
        ];

        const selectSeasons = this.state.seasons.map((s, idx) => <option key={idx} value={s.year}>{s.year}</option>);

        return (
            <div>
                <h1>Importar Jogadores - {this.state.step ? this.state.step.description : ''}</h1>
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
                    defaultSorted={[{ id: "id", desc: false }]}
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
