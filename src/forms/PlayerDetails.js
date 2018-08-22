import React, { Component, Fragment } from 'react';
import {
    Alert, FormGroup, FormControl, ControlLabel,
    Button, Checkbox, Panel, Image
} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import axios from 'axios';
import queryString from 'query-string';
import settings from '../settings';
import errors from '../components/Errors';
import { validateNotEmpty, isValidEmail, isValidPhone, 
    isValidDate, isCaretakerRequired } from '../utils/validations';
import { FieldGroup } from '../utils/controls';
import '../styles/PlayerForm.css'

export default class PlayerDetails extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.fetchPlayer = this.fetchPlayer.bind(this);
        this.validateForm = this.validateForm.bind(this);

        const stepId = props.match.params.stepId;

        const playerId = props.match.params.playerId;
        const queryStringValues = queryString.parse(this.props.location.search)
        const edit = queryStringValues.edit ? true : false;

        this.state = {
            season: props.match.params.year,
            isSeasonActive: props.isSeasonActive || false,
            teamId: props.teamId,
            stepId: stepId,
            steps: [],
            playerId: playerId,
            personId: null,
            roleId: null,
            playerName: '',
            gender: '',
            birth: null,
            docId: '',
            phoneNr: '',
            email: '',
            isResident: false,
            isLocalBorn: false,
            voterNr: '',
            caretakerName: '',
            caretakerDocId: '',
            newPhotoUpload: false,
            photoSrc: null,
            comments: '',
            docExists: false,
            doc: null,
            isEditing: edit,
            caretakerId: null,
            isEditSuccess: null,
            isSubmitting: false
        };
    }

    componentDidMount() {
        const isSeasonActive = this.props.isSeasonActive;
        if (isSeasonActive && isSeasonActive !== this.state.isSeasonActive) {
            this.setState({ isSeasonActive: isSeasonActive });
        }

        this.fetchPlayer();
    }

    // componentDidUpdate() {
    //     if (this.state.isEditSuccess !== null) {
    //         this.setState({ isEditSuccess: null });
    //     }
    // }

    fetchPlayer() {
        const { season, teamId, stepId, playerId } = this.state;

        const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + playerId;
        axios.get(url)
            .then(results => {
                //console.log('Player: ', results);
                const { player, photo } = results.data;
                const { person, caretaker } = player;
                const voterNr = caretaker && caretaker.VoterNr ? caretaker.VoterNr : (person.VoterNr ? person.VoterNr : '');
                this.setState({
                    personId: person.Id,
                    roleId: player.RoleId,
                    playerName: person.Name,
                    birth: isValidDate(person.Birthdate) ? new Date(person.Birthdate) : null,
                    docId: person.IdCardNr,
                    gender: person.Gender,
                    isResident: player.Resident ? true : false,
                    isLocalBorn: person.LocalBorn ? true : false,
                    voterNr: voterNr,
                    phoneNr: caretaker && caretaker.Phone ? caretaker.Phone : (person.Phone ? person.Phone : ''),
                    email: caretaker && caretaker.Email ? caretaker.Email : (person.Email ? person.Email : ''),
                    caretakerId: player.CareTakerId,
                    caretakerName: caretaker ? caretaker.Name : '',
                    caretakerDocId: caretaker ? caretaker.IdCardNr : '',
                    comments: player.Comments,
                    stepDescr: player.step.Description,
                    steps: [player.step],
                    photoSrc: photo,
                    newPhotoUpload: false,
                    docExists: player.DocFilename ? true : false
                });
                window.scrollTo(0, 0);
            })
            .catch(errors.handleError);
    }

    handleGenderSelect(evt) {
        this.setState({ gender: evt.target.value });
    }

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        //console.log(fieldName, fieldVal);
        this.setState({ [fieldName]: fieldVal });
    }

    handleCheckboxToggle(evt) {
        let fieldName = evt.target.name;
        //console.log(fieldName, fieldVal);
        this.setState({ [fieldName]: !this.state[fieldName] });
    }

    handleEdit() {
        this.setState({ isEditing: true, isEditSuccess: null });
    }

    validateForm() {
        let result = true;
        const { playerName, docId, gender, birth, email, phoneNr, caretakerName, caretakerDocId } = this.state;
        result = result &&
                playerName && playerName !== '' &&
                docId && docId !== '' &&
                isValidEmail(email) && isValidPhone(phoneNr);
                
        if (this.state.roleId == 1) {
            result = result &&
                gender && gender !== '' &&
                birth && birth !== '';

            const { steps, stepId, roleId } = this.state;
            if (isCaretakerRequired(steps, stepId, roleId, birth, this.props.eighteenDate)) {
                result = result &&
                    caretakerName && caretakerName !== '' &&
                    caretakerDocId && caretakerDocId !== '';
            }
        }
        return result;
    }

    handleSubmit(evt) {
        if (this.validateForm()) {
            const { season, teamId, stepId, personId, playerId, steps, roleId, birth } = this.state;
            const caretakerRequired = isCaretakerRequired(steps, stepId, roleId, birth, this.props.eighteenDate);
            if (personId !== null) {
                console.log('Submitting player...');
                this.setState({ isSubmitting: true }, () => {
                    const data = {
                        player: {
                            roleId: this.state.roleId,
                            comments: this.state.comments,
                            photo: this.state.newPhotoUpload ? this.state.photoSrc : null,
                            doc: this.state.doc,
                            isResident: this.state.isResident
                        },
                        person: {
                            id: this.state.personId,
                            name: this.state.playerName,
                            docId: this.state.docId,
                            gender: this.state.gender,
                            birth: this.state.birth,
                            email: caretakerRequired ? null : this.state.email,
                            phoneNr: caretakerRequired ? null : this.state.phoneNr,
                            voterNr: caretakerRequired || !this.state.isResident ? null : this.state.voterNr,
                            isLocalBorn: this.state.isLocalBorn
                        },
                        caretaker: caretakerRequired ? {
                            id: this.state.caretakerId,
                            name: this.state.caretakerName,
                            docId: this.state.caretakerDocId,
                            email: caretakerRequired ? this.state.email : null,
                            phoneNr: caretakerRequired ? this.state.phoneNr : null,
                            voterNr: this.state.isResident && caretakerRequired ? this.state.voterNr : null
                        } : null
                    };
                    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + playerId;
                    axios.patch(url, data)
                        .then(result => {
                            //console.log(result);
                            this.fetchPlayer();
                            this.setState({ isEditing: false, isEditSuccess: true, isSubmitting: false });
                            //this.props.history.push('/seasons/' + season + '/steps/' + stepId + '/players/' + playerId + '?success');
                            // if (result.data && result.data.length > 0) {
                            //     this.setState({ data: result.data });
                            // }
                        })
                        .catch((err) => {
                            const errMsgs = { e409: 'Jogador já está inscrito no escalão escolhido.' };
                            errors.handleError(err, errMsgs);
                            this.setState({ isSubmitting: false });
                        });
                });
            }
        }
        else {
            alert('Campos inválidos ou não preenchidos!');
        }
        evt.preventDefault();
    }

    handleCancel() {
        this.fetchPlayer();
        this.setState({ isEditing: false });
    }

    handlePhoto(evt) {
        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; i < files.length; i++) {
            f = files[i]
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();
            let self = this;
            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    self.setState({ photoSrc: e.target.result, newPhotoUpload: true });
                    // Render thumbnail.
                    // var span = document.createElement('span');
                    // span.innerHTML = ['<img class="thumb" src="', e.target.result,
                    //     '" title="', escape(theFile.name), '"/>'].join('');
                    // document.getElementById('list').insertBefore(span, null);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

    handleDoc(evt) {
        var files = evt.target.files; // FileList object

        let self = this;
        const onload = (theFile) =>
            function (e) {
                self.setState({ doc: reader.result });
                //self.setState({ doc: window.btoa(reader.result) });
            };

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; i < files.length; i++) {
            f = files[i]

            if (f.type.match('image.*') || f.type.match('application.pdf')) {
                var reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = (onload)(f);

                reader.readAsDataURL(f);
                //reader.readAsBinaryString(f);
            }
        }
    }

    onChangeBirthdate = date => this.setState({ birth: date })

    render() {
        const title = this.state.isEditing ? 
            (this.state.roleId == 1 ? "Editar Jogador" : "Editar Elemento Equipa Técnica") : 
            (this.state.roleId == 1 ? "Ficha de Jogador" : "Ficha de Elemento Equipa Técnica");

        const formDetails = this.state.playerId ?
            <FormPlayer {...this.state}
                onChangeBirthdate={this.onChangeBirthdate}
                handleControlChange={this.handleControlChange.bind(this)}
                handleCheckboxToggle={this.handleCheckboxToggle.bind(this)}
                handleGenderSelect={this.handleGenderSelect.bind(this)}
                handlePhoto={this.handlePhoto.bind(this)}
                handleEdit={this.handleEdit.bind(this)}
                handleDoc={this.handleDoc.bind(this)} /> :
            <div />;

        return (
            <div>
                {this.state.isEditSuccess ?
                    <Alert bsStyle="success">
                        <strong>{this.state.roleId == 1 ? "Jogador" : "Elemento "} alterado com sucesso.</strong>
                    </Alert> : ''}
                <h2>{title}</h2>
                <form>
                    {formDetails}
                    {this.state.isEditing ?
                        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <Button bsStyle="primary" disabled={this.state.isSubmitting}
                                onClick={this.handleCancel} style={{ margin: '3px' }}>Cancelar</Button>
                            <Button bsStyle="primary" type="submit" disabled={this.state.isSubmitting}
                                onClick={this.handleSubmit} style={{ margin: '3px' }}>Confirmar</Button>
                            <span style={{ display: this.state.isSubmitting ? 'inline' : 'none' }}><img src="/show_loader.gif" alt="" style={{ height: '40px', width: '40px' }} /></span>
                        </div> :
                        ''}
                </form>
            </div>
        );
    }
}

function FormPlayer(props) {
    const caretakerRequired = isCaretakerRequired(props.steps, props.stepId, props.roleId, props.birth, props.eighteenDate);

    const validateEmail = () => {
        if (!isValidEmail(props.email)) return 'error';
        return null;
    };

    const validatePhone = () => {
        if (!isValidPhone(props.phoneNr)) return 'error';
        return null;
    };

    const commonFields =
        <Fragment>
            <FieldGroup
                id="formEmail"
                type="email"
                name="email"
                label={caretakerRequired ? "Email do Responsável" : "Email"}
                placeholder={caretakerRequired ? "Email do Responsável" : "Email"}
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
                label={caretakerRequired ? "Telefone do Responsável" : "Telefone"}
                placeholder={caretakerRequired ? "Telefone do Responsável" : "Telefone"}
                value={props.phoneNr}
                onChange={props.handleControlChange}
                readOnly={!props.isEditing || props.isSubmitting }
                maxLength="16"
                validationState={validatePhone}
            />
            { props.roleId == 1 ?
                <Checkbox checked={props.isResident} disabled={!props.isEditing || props.isSubmitting}
                    name="isResident" onChange={props.handleCheckboxToggle} >
                    <span style={{ fontWeight: '700' }}>Residente na freguesia?</span>
                </Checkbox> : ''}
            {props.isResident ?
                <FieldGroup
                    id="formVoterNr"
                    type="text"
                    name="voterNr"
                    label={caretakerRequired ? "Nr de Eleitor do Responsável" : "Nr de Eleitor"}
                    placeholder={caretakerRequired ? "Nr de Eleitor do Responsável" : "Nr de Eleitor"}
                    value={props.voterNr}
                    onChange={props.handleControlChange}
                    readOnly={!props.isEditing || props.isSubmitting}
                    maxLength="10"
                /> : ''}
            {props.isResident && props.isEditing ?
                <Fragment>
                    Se não sabe o Nr de Eleitor pode obtê-lo aqui:&nbsp;
                    <a href="https://www.recenseamento.mai.gov.pt/" target="_blank" rel="noopener noreferrer">https://www.recenseamento.mai.gov.pt/</a>
                </Fragment> : ''}
        </Fragment>;

    const caretakerCtrls = caretakerRequired ?
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
                    value={props.caretakerName}
                    onChange={props.handleControlChange}
                    readOnly={!props.isEditing || props.isSubmitting}
                    validationState={validateNotEmpty}
                    validationArgs={props.caretakerName}
                    maxLength="80"
                />
                <FieldGroup
                    id="formCaretakerIdCard"
                    type="text"
                    name="caretakerDocId"
                    label="Nr Cartão Cidadão do Responsável"
                    placeholder="Nr Cartão Cidadão do Responsável"
                    value={props.caretakerDocId}
                    onChange={props.handleControlChange}
                    readOnly={!props.isEditing || props.isSubmitting}
                    validationState={validateNotEmpty}
                    validationArgs={props.caretakerDocId}
                    maxLength="30"
                />
                {commonFields}
            </Panel.Body>
        </Panel> :
        <div />;

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

    const docUploaders = props.isEditing ?
        <div className="column">
            {photoUploader}    
            { props.roleId == 1 ? docUploader : '' } 
        </div> :
        ( props.isSeasonActive && props.roleId == 1 ?
            <Fragment>
                <p style={{ margin: '2px'}}><span style={{ color: props.docExists ? 'green' : 'red' }}>Ficha individual do Jogador
                    {props.docExists ? ' submetida.' : ' em falta!'}
                </span></p>
            </Fragment> : '' );

    const showEditButton = props.isSeasonActive && (!props.personId || !props.isEditing);
    const editButton = showEditButton ?
        <div className="column" style={{ float: 'right' }}>
            <Button bsStyle="primary" onClick={props.handleEdit}>Editar</Button>
        </div> : '';

    const getStepDate = (prop, defaultDate) => {
        let result = defaultDate;
        const step = props.steps.find((s) => s.Id == props.stepId);
        if (step) {
            result = new Date(step[prop]);
        }
        return result;
    };

    const selectSteps = props.steps.map((s) => <option key={s.Id} value={s.Id}>{s.Description}</option>);

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
        <FieldGroup
            id="formName"
            type="text"
            name="playerName"
            label={props.roleId == 1 ? "Nome do Jogador" : "Nome" }
            placeholder={props.roleId == 1 ? "Nome do Jogador" : "Nome" }
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
            name="docId"
            label={props.roleId == 1 ? "Nr Cartão Cidadão do Jogador" : "Nr Cartão Cidadão" }
            placeholder={props.roleId == 1 ? "Nr Cartão Cidadão do Jogador" : "Nr Cartão Cidadão" }
            value={props.docId}
            onChange={props.handleControlChange}
            readOnly={true}
            maxLength="30"
        />
        <FormGroup controlId="formBirthdate">
            <ControlLabel>Data Nascimento{ props.roleId == 1 ? " do Jogador" : ""}</ControlLabel>
            <div>
                <DatePicker onChange={props.onChangeBirthdate} value={props.birth}
                    required={true} locale="pt-PT" disabled={!props.isEditing || props.isSubmitting}
                    minDate={getStepDate('MinDate', new Date('1900-01-01T00:00:00.000Z'))}
                    maxDate={getStepDate('MaxDate', new Date())}
                    calendarClassName="date-picker-form-control" />
            </div>
        </FormGroup>

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
        { props.roleId == 1 ?
                <Checkbox checked={props.isLocalBorn} disabled={!props.isEditing || props.isSubmitting}
                    name="isLocalBorn" onChange={props.handleCheckboxToggle} >
                    <span style={{ fontWeight: '700' }}>Natural da freguesia (registado como nascido na freguesia) ?</span>
                </Checkbox> : ''}
        {caretakerCtrls}
        {caretakerRequired ? <div /> : commonFields}
        <FormGroup controlId="formComments">
            <ControlLabel>Notas Adicionais</ControlLabel>
            <FormControl componentClass="textarea" placeholder="Notas"
                name="comments" value={props.comments} onChange={props.handleControlChange}
                readOnly={!props.isEditing || props.isSubmitting} maxLength="2000" />
        </FormGroup>
    </div>);
}
