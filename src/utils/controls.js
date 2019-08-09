import React from 'react';
import {
    FormGroup, FormControl, ControlLabel, HelpBlock
} from 'react-bootstrap';

function FieldGroup({ id, label, help, validationState, validationArgs, ...props }) {
    var state = validationState ? (validationArgs ? validationState(validationArgs) : validationState()) : null;
    return (
        <FormGroup controlId={id} 
            validationState={state}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

export {
    FieldGroup
}