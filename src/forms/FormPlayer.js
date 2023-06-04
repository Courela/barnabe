import React, { Fragment } from 'react';
import {
    FormGroup, FormControl, ControlLabel,
    Button, Checkbox, Image
} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import CommonForm from './CommonForm';
import CaretakerForm from './CaretakerForm';
import { FieldGroup } from '../components/Controls';
import { validateNotEmpty, isCaretakerRequired } from '../utils/validations';
import utils from '../utils/common';
import '../styles/PlayerForm.css'

export default function FormPlayer(props) {
    const isAdmin = props.location.pathname.includes('admin');
    const caretakerRequired = isCaretakerRequired(props.steps, props.stepId, props.roleId, props.birth, props.eighteenDate);

    const downloadDoc = (doc) => {
        const FILE_REGEX = /^data:(.+)\/(.+);base64,/;
        const fileType = (doc ? doc.substring(0, 50) : '').match(FILE_REGEX);
        //console.log('File type: ', fileType);
        var stripString = doc.substring(5 + fileType[1].length + 1 + fileType[2].length + 8);
        // var buf = Buffer.from(stripString);
        // var blob = new Blob([buf]);
        var blob = utils.b64toBlob(stripString, fileType[1]+ '/' + fileType[2]);
        return window.URL.createObjectURL(blob);
    };

    const photoUploader = <FieldGroup
            id="formFoto"
            type="file"
            label="Fotografia"
            help="Digitalização de Fotografia do Jogador"
            onChange={props.handlePhoto}
            readOnly={!props.isEditing || props.isSubmitting}
            accept="image/*"
        />;
    
    const docUploader = <FieldGroup
            id="formDoc"
            type="file"
            label="Ficha individual de jogador"
            help="Ficha individual de jogador"
            onChange={props.handleDoc}
            readOnly={!props.isEditing || props.isSubmitting}
            accept="image/*,application/pdf"
        />;

    const downloadDocLink = props.doc ? 
        <p><a href={downloadDoc(props.doc)} target="_blank" rel="noopener noreferrer">Download</a></p> :
        props.docExists ?
            <p><img src="/show_loader.gif" alt="loading..." height="50px" width="50px"/></p> :
            '';
    const docUploaders = props.isEditing ?
        <div className="column">
            {photoUploader}    
            { props.roleId === 1 ? docUploader : '' } 
        </div> :
        ((props.isSeasonActive || isAdmin) && props.roleId === 1 ?
            <Fragment>
                <p style={{ margin: '2px'}}>
                    <span style={{ color: props.docExists ? 'green' : 'red' }}>Ficha individual do Jogador
                        {props.docExists ? ' submetida.' : ' em falta!'}
                    </span>
                </p>
                {downloadDocLink}
            </Fragment> : '' );

    const showEditButton = (props.isSeasonActive || isAdmin) && (!props.personId || !props.isEditing);
    const editButton = showEditButton ?
        <div className="column" style={{ float: 'right' }}>
            <Button bsStyle="primary" onClick={props.handleEdit}>Editar</Button>
        </div> : '';

    const getStepDate = (prop, defaultDate) => {
        let result = defaultDate;
        const step = props.steps.find((s) => s ? s.Id === props.stepId : false);
        if (step) {
            result = new Date(step[prop]);
        }
        return result;
    };

    const selectSteps = props.steps.map((s, i) => s && s.id ? 
                    <option key={s.id} value={s.id}>{s.description}</option> : 
                    <option key={i}></option>);

    const selectRoles = props.roles.map((r) => <option key={r.id} value={r.id}>{r.description}</option>);

    return (<div>
        <FormGroup controlId="selectStep">
            <ControlLabel>Escalão</ControlLabel>
            <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                value={props.stepId}
                disabled={true}>
                {selectSteps}
            </FormControl>
            <FormControl.Feedback />
        </FormGroup>

        <div style={{ display: 'flex', maxHeight: '200px' }}>
            <Image id="photoThumb" thumbnail src={props.photoSrc ? props.photoSrc : '/no_image.jpg'}
                className="column"
                style={{ maxWidth: "200px", border: props.isSeasonActive && !props.photoSrc ? '1px solid red' : 'none' }} />
            {docUploaders}
            {editButton}
        </div>
        { props.roleId && props.roleId !== 1 ?
            <FormGroup controlId="selectRole" validationState={props.validateRole()}>
                <ControlLabel>Função</ControlLabel>
                <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                    onChange={props.handleRoleSelect} value={props.roleId}
                    disabled={props.roles.length <= 1 && props.roleId > 0}>
                    <option value="0">Escolha...</option>
                    {selectRoles}
                </FormControl>
                <FormControl.Feedback />
            </FormGroup>
            : ''}
        <FieldGroup
            id="formName"
            type="text"
            name="playerName"
            label={props.roleId === 1 ? "Nome do Jogador" : "Nome" }
            placeholder={props.roleId === 1 ? "Nome do Jogador" : "Nome" }
            value={props.playerName}
            onChange={props.handleControlChange}
            readOnly={!props.isEditing || props.isSubmitting}
            maxLength="80"
            validationState={validateNotEmpty}
            validationArgs={props.playerName}
        />
        <FieldGroup
            id="formIdCard"
            type="text"
            name="idCardNr"
            label={props.roleId === 1 ? "Nr Cartão Cidadão do Jogador" : "Nr Cartão Cidadão" }
            placeholder={props.roleId === 1 ? "Nr Cartão Cidadão do Jogador" : "Nr Cartão Cidadão" }
            value={props.idCardNr}
            onChange={props.handleControlChange}
            readOnly={true}
            maxLength="30"
        />
        { props.roleId === 1 ?
            <FormGroup controlId="formBirthdate">
                <ControlLabel>Data Nascimento{ props.roleId === 1 ? " do Jogador" : ""}</ControlLabel>
                <div>
                    <DatePicker onChange={props.onChangeBirthdate} value={props.birth}
                        required={true} locale="en-GB" disabled={!props.isEditing || props.isSubmitting}
                        minDate={getStepDate('MinDate', new Date('1900-01-01T00:00:00.000Z'))}
                        maxDate={getStepDate('MaxDate', new Date())}
                        calendarClassName="date-picker-form-control" />
                </div>
            </FormGroup> : ''}
        <FormGroup controlId="selectGender">
            <ControlLabel>Género</ControlLabel>
            <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                onChange={props.handleGenderSelect} value={props.gender}
                disabled={!props.isEditing || props.isSubmitting}>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
            </FormControl>
            <FormControl.Feedback />
        </FormGroup>
        { props.roleId === 1 ?
                <Checkbox checked={props.isLocalBorn} disabled={!props.isEditing || props.isSubmitting}
                    name="isLocalBorn" onChange={props.handleCheckboxToggle} >
                    <span style={{ fontWeight: '700' }}>Natural da freguesia (registado como nascido na freguesia) ?</span>
                </Checkbox> : ''}
        { props.roleId === 1 ?
                <Checkbox checked={props.isLocalTown} disabled={!props.isEditing || props.isSubmitting}
                    name="isLocalTown" onChange={props.handleCheckboxToggle} >
                    <span style={{ fontWeight: '700' }}>Residente na freguesia ?</span>
                </Checkbox> : ''}
        {caretakerRequired ?
            <CaretakerForm {...props} /> :
            <div />}
        {caretakerRequired ? 
            <div /> : 
            <CommonForm {...props} 
                caretakerRequired={caretakerRequired} 
            />}
        <FormGroup controlId="formComments">
            <ControlLabel>Notas Adicionais</ControlLabel>
            <FormControl componentClass="textarea" placeholder="Notas"
                name="comments" value={props.comments || ''} onChange={props.handleControlChange}
                readOnly={!props.isEditing || props.isSubmitting} maxLength="2000" />
        </FormGroup>
    </div>);
}
