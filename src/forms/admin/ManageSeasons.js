import React, { Component, Fragment } from 'react';
import {
    FormGroup, FormControl, ControlLabel, Button, Tabs, Tab
} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import errors from '../../components/Errors';
import { getSeasons } from '../../utils/communications';
import { FieldGroup } from '../../utils/controls';
import { validateNotEmpty } from '../../utils/validations';
import { addSeason } from '../../utils/communications';

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
            .then(results => {
                this.setState({ seasons: results.data });
            })
            .catch(errors.handleError);
    }

    validateSeason() {
        if (this.state.year === '' || parseInt(this.state.year) <= 0) return 'error';
        return null;
    }

    handleTabSelect(key) {
        this.setState({ key });
      }

    handleSeasonSelect(evt) {
        const year = evt.target.value;
        var selectedSeason = this.state.seasons.find(e => e.Year === parseInt(year));
        this.setState({ 
            season: selectedSeason != null ? selectedSeason : {},
            year: year,
            status: selectedSeason != null && selectedSeason.IsActive ? 1 : 0,
            signUpDueDate: selectedSeason != null ? selectedSeason.SignUpDueDate : null,
            startDate: selectedSeason != null ? selectedSeason.StartDate : null
        });
    }

    onChangeSignUpDate = date => this.setState({ signUpDueDate: date });
    onChangeStartDate = date => this.setState({ startDate: date });

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        //console.log(fieldName, fieldVal);
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmit(evt) {
        if (this.state.key === 1) {
            if (this.state.season.Year) {
                //const url = settings.API_URL + '/api/admin/seasons/activate';
                // const data = {
                //     season: this.state.season
                // };
                // axios.post(url, data)
                //     .then(result => {
                //         console.log(result);
                //         alert('Época activada.');
                //     })
                //     .catch((err) => {
                //         errors.handleError(err);
                //     });
            }
        }
        if (this.state.key === 2) {
            const { year, status, signUpDueDate, startDate } = this.state;
            addSeason(parseInt(year), status, signUpDueDate, startDate);
        }
        evt.preventDefault();
    }

    render() {
        const selectSeasons = this.state.seasons.map((s, idx) => <option key={idx} value={s.Year}>{s.Year}</option>);
        return (
            <Tabs id='seasonTabs' activeKey={this.state.key} onSelect={this.handleTabSelect}>
                <Tab eventKey={1} title="Ver">
                    <form>
                        <FormGroup controlId="selectSeason" validationState={this.validateSeason()}>
                            <ControlLabel>Época</ControlLabel>
                            <FormControl componentClass="select" placeholder="select"
                                onChange={this.handleSeasonSelect}>
                                <option value="0">Escolha...</option>
                                {selectSeasons}
                            </FormControl>
                            <FormControl.Feedback />
                        </FormGroup>
                        <div style={ { display: this.state.season.Year ? 'block' : 'none' } }>
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