import React, { Component, Fragment } from 'react';
import {
    FormGroup, FormControl, ControlLabel, Button, Tabs, Tab
} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import errors from '../../components/Errors';
import { getSeasons, addSeason, updateSeason } from '../../utils/communications';
import { FieldGroup } from '../../utils/controls';
import { validateNotEmpty } from '../../utils/validations';

export default class ManageSeasons extends Component {
    constructor(props, context) {
        super(props, context);

        this.validateSeason = this.validateSeason.bind(this);
        this.handleTabSelect = this.handleTabSelect.bind(this);
        this.handleSeasonSelect = this.handleSeasonSelect.bind(this);
        this.onChangeSignUpDate = this.onChangeSignUpDate.bind(this);
        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.handleControlChange = this.handleControlChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            key: 1,
            seasons: [],
            season: {},
            year: '',
            status: 0,
            signUpDueDate: null,
            startDate: null
        }
    }

    componentDidMount() {
        getSeasons()
            .then(seasons => {
                this.setState({ seasons: seasons });
            })
            .catch(errors.handleError);
    }

    validateSeason() {
        if (this.state.year === '' || parseInt(this.state.year, 10) <= 0) return 'error';
        return null;
    }

    handleTabSelect(key) {
        this.setState({ key, season: {}, year: '', status: 0, signUpDueDate: null, startDate: null });
      }

    handleSeasonSelect(evt) {
        const year = evt.target.value;
        var selectedSeason = this.state.seasons.find(e => e.year === parseInt(year, 10));
        this.setState({ 
            season: selectedSeason ? selectedSeason : {},
            year: year,
            status: selectedSeason && selectedSeason.is_active ? 1 : 0,
            signUpDueDate: selectedSeason ? selectedSeason.sign_up_due_date : null,
            startDate: selectedSeason ? selectedSeason.start_date : null
        });
    }

    onChangeSignUpDate = date => this.setState({ signUpDueDate: date });
    onChangeStartDate = date => this.setState({ startDate: date });

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmit(evt) {
        if (this.state.key === 1) {
            if (this.state.season.year) {
                const { year, status, signUpDueDate, startDate } = this.state;
                updateSeason(parseInt(year, 10), status, signUpDueDate, startDate, 
                    //TODO update extra sign up date
                    new Date(2025, 1))
                    .then(() => alert("Época atualizada."));
            }
        }
        if (this.state.key === 2) {
            const { year, status, signUpDueDate, startDate } = this.state;
            addSeason(parseInt(year, 10), status, signUpDueDate, startDate)
                .then(() => alert("Época criada."));;
        }
        evt.preventDefault();
    }

    render() {
        const selectSeasons = this.state.seasons.map((s, idx) => <option key={idx} value={s.year}>{s.year}</option>);
        return (
            <Tabs id='seasonTabs' activeKey={this.state.key} onSelect={this.handleTabSelect}>
                <Tab eventKey={1} title="Ver">
                    <form>
                        <FormGroup controlId="selectSeason" validationState={this.validateSeason()}>
                            <ControlLabel>Época</ControlLabel>
                            <FormControl componentClass="select" placeholder="select"
                                value={this.state.year}
                                onChange={this.handleSeasonSelect}>
                                <option value="0">Escolha...</option>
                                {selectSeasons}
                            </FormControl>
                            <FormControl.Feedback />
                        </FormGroup>
                        <div style={ { display: this.state.season.year ? 'block' : 'none' } }>
                            <SeasonDetails 
                                onChangeSignUpDate={this.onChangeSignUpDate}
                                onChangeStartDate={this.onChangeStartDate}
                                handleControlChange={this.handleControlChange} 
                                status={this.state.status}
                                signUpDueDate={this.state.signUpDueDate} 
                                startDate={this.state.startDate}
                                handleSubmit={this.handleSubmit} />
                        </div>
                    </form>
                </Tab>
                <Tab eventKey={2} title="Criar">
                    <FieldGroup
                        id="formYear"
                        type="text"
                        name="year"
                        label="Ano"
                        placeholder="Ano"
                        value={this.state.year}
                        onChange={this.handleControlChange}
                        maxLength="4"
                        validationState={validateNotEmpty}
                        validationArgs={this.state.year}
                    />
                    <SeasonDetails 
                        onChangeSignUpDate={this.onChangeSignUpDate}
                        onChangeStartDate={this.onChangeStartDate}
                        handleControlChange={this.handleControlChange} 
                        status={this.state.status}
                        signUpDueDate={this.state.signUpDueDate} 
                        startDate={this.state.startDate}
                        handleSubmit={this.handleSubmit} />
                </Tab>
            </Tabs>
            );
    }
}

function SeasonDetails(props) {
    return (
        <Fragment>
            <FormGroup controlId="seasonStatus">
                <ControlLabel>Estado</ControlLabel>
                <FormControl name="status" componentClass="select" placeholder="select"
                    onChange={props.handleControlChange} value={props.status}>
                    <option value="0">Inactiva</option>
                    <option value="1">Activa</option>
                </FormControl>
                <FormControl.Feedback />
            </FormGroup>

            <FormGroup controlId="formSignUpDueDate">
                <ControlLabel>Data limite inscrições</ControlLabel>
                <div>
                    <DatePicker name="signUpDueDate" onChange={props.onChangeSignUpDate} value={props.signUpDueDate}
                        required={true} locale="pt-PT"
                        calendarClassName="date-picker-form-control" />
                </div>
                <ControlLabel>Data de começo</ControlLabel>
                <div>
                    <DatePicker name="startDate" onChange={props.onChangeStartDate} value={props.startDate}
                        required={true} locale="pt-PT"
                        calendarClassName="date-picker-form-control" />
                </div>
            </FormGroup>

            <Button bsStyle="primary" type="submit" onClick={props.handleSubmit}>Guardar</Button>
        </Fragment>);
}