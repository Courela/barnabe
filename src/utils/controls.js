import React from 'react';
import {
    FormGroup, FormControl, ControlLabel, HelpBlock
} from 'react-bootstrap';

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id} validationState={props.validationState ? (props.validationArgs ? props.validationState(...props.validationArgs) : props.validationState()) : null}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

export {
    FieldGroup
}