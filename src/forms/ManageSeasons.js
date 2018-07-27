import React, { Component } from 'react';
import {
    FormGroup, FormControl, ControlLabel, Button
} from 'react-bootstrap';
import axios from 'axios';
import settings from '../settings';
import errors from '../components/Errors';

export default class ManageSeasons extends Component {
    constructor(props, context) {
        super(props, context);

        this.validateSeason = this.validateSeason.bind(this);
        this.handleSeasonSelect = this.handleSeasonSelect.bind(this);
        this.handleControlChange = this.handleControlChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            seasons: [],
            season: 0
        }
    }

    componentDidMount() {
        const url = settings.API_URL + '/api/seasons';
        axios.get(url)
            .then(results => {
                this.setState({ seasons: results.data.map(s => ({ id: s.Year, descr: s.Year })) });
            })
            .catch(errors.handleError);
    }

    validateSeason() {
        if (this.state.season <= 0) return 'error';
        return null;
    }

    handleSeasonSelect(evt) {
        this.setState({ season: evt.target.value });
    }

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        //console.log(fieldName, fieldVal);
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmit(evt) {
        if (this.state.season > 0) {
            const url = settings.API_URL + '/api/admin/seasons/activate';
            const data = {
                season: this.state.season
            };
            axios.post(url, data)
                .then(result => {
                    console.log(result);
                    alert('Época activada.');
                })
                .catch((err) => {
                    errors.handleError(err);
                });
        }
        evt.preventDefault();
    }

    render() {
        const selectSeasons = this.state.seasons.map((s, idx) => <option key={idx} value={s.id}>{s.descr}</option>);

        return (
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
                <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Guardar</Button>
            </form>);
    }
}
