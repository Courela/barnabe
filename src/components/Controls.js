import React from 'react';
import {
    FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

export function SeasonSelect(props) {
    const selectSeasons = props.seasons.map(s => { return { value: (s.Year ? s.Year : s), description: (s.Year ? s.Year : s )}; });

    return <Select controlId="selectSeason" name="season" label="Época" 
        options={selectSeasons} value={props.value} 
        onChange={props.onChange} validationState={props.validationState} />;
}

export function TeamSelect(props) {
    var controlId = props.controlId ? props.controlId : "selectTeam";
    var name = props.name ? props.name : "teamId";
    var label = props.label ? props.label : "Equipa";
    
    const selectTeams = props.teams.map(t => { return { value: t.Id, description: t.ShortDescription }; });

    return <Select controlId={controlId} name={name} label={label} 
        options={selectTeams} value={props.value} 
        onChange={props.onChange} validationState={props.validationState} />
}

export function StepSelect(props) {
    const selectSteps = props.steps.map(s => { return { value: s.Id, description: s.Description }; });
 
    return <Select controlId="selectStep" name="stepId" label="Escalão" 
        options={selectSteps} value={props.value} 
        onChange={props.onChange} validationState={props.validationState} />;
}

export function Select(props) {
    const options = props.options.map((o, idx) => <option key={idx} value={o.value}>{o.description}</option>);

    return (
        <FormGroup controlId={props.controlId} validationState={props.validationState}>
            <ControlLabel>{props.label}</ControlLabel>
            <FormControl name={props.name} componentClass="select" placeholder="select" style={{ width: 200 }}
                onChange={props.onChange} value={props.value}>
                <option value="0">Escolha...</option>
                {options}
            </FormControl>
            <FormControl.Feedback />
        </FormGroup>);
}
