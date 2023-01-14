import React from 'react';
import { Panel } from 'react-bootstrap';
import { FieldGroup } from '../components/Controls';
import { validateNotEmpty } from '../utils/validations';
import '../styles/PlayerForm.css'
import CommonForm from './CommonForm';

export default function CaretakerDetails(props) {
    return (
        <Panel>
            <Panel.Heading>
                <Panel.Title componentClass="h3">Dados do Responsável (Mãe/Pai/Tutor)</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                <FieldGroup
                    id="formCaretakerName"
                    type="text"
                    name="caretakerName"
                    label="Nome do Responsável"
                    placeholder="Nome do Responsável"
                    value={props.caretakerName || ''}
                    onChange={props.handleControlChange}
                    readOnly={!props.isEditing || props.isSubmitting}
                    validationState={validateNotEmpty}
                    validationArgs={props.caretakerName}
                    maxLength="80"
                />
                <FieldGroup
                    id="formCaretakerIdCard"
                    type="text"
                    name="caretakerIdCardNr"
                    label="Nr Cartão Cidadão do Responsável"
                    placeholder="Nr Cartão Cidadão do Responsável"
                    value={props.caretakerIdCardNr || ''}
                    onChange={props.handleControlChange}
                    readOnly={!props.isEditing || props.isSubmitting}
                    validationState={validateNotEmpty}
                    validationArgs={props.caretakerIdCardNr}
                    maxLength="30"
                />
                <CommonForm {...props} />
            </Panel.Body>
        </Panel>
    );
}