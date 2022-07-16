import React, { Fragment } from 'react';
import { Checkbox } from 'react-bootstrap';
import { FieldGroup } from '../utils/controls';
import { isValidEmail, isValidPhone } from '../utils/validations';
import '../styles/PlayerForm.css'

export default function CommonForm(props) {
    const validateEmail = () => {
        if (!isValidEmail(props.email)) return 'error';
        return null;
    };

    const validatePhone = () => {
        if (!isValidPhone(props.phoneNr)) return 'error';
        return null;
    };

    return (
        <Fragment>
            <FieldGroup
                id="formEmail"
                type="email"
                name="email"
                label={props.caretakerRequired ? "Email do Responsável" : "Email"}
                placeholder={props.caretakerRequired ? "Email do Responsável" : "Email"}
                value={props.email}
                onChange={props.handleControlChange}
                readOnly={!props.isEditing || props.isSubmitting}
                maxLength="100"
                validationState={validateEmail}
            />
            <FieldGroup
                id="formPhone"
                type="text"
                name="phoneNr"
                label={props.caretakerRequired ? "Telefone do Responsável" : "Telefone"}
                placeholder={props.caretakerRequired ? "Telefone do Responsável" : "Telefone"}
                value={props.phoneNr}
                onChange={props.handleControlChange}
                readOnly={!props.isEditing || props.isSubmitting }
                maxLength="16"
                validationState={validatePhone}
            />
            { props.roleId === 1 ?
                <Fragment>
                    <Checkbox checked={props.isResident} disabled={!props.isEditing || props.isSubmitting}
                        name="isResident" onChange={props.handleCheckboxToggle} >
                        <span style={{ fontWeight: '700' }}>Residente na freguesia?</span>
                    </Checkbox>
                    Para efeitos de valição do estatuto de residente será usada a morada registada no
                    Cartão do Cidadão (usada para efeitos de votação eleitoral). Pode validar a morada aqui:&nbsp;
                    <a href="https://www.recenseamento.mai.gov.pt/" target="_blank" rel="noopener noreferrer">https://www.recenseamento.mai.gov.pt/</a>
                </Fragment> : ''}
        </Fragment>
    );
}