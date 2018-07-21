import React, { Component, Fragment } from 'react';
import {
    Alert, FormGroup, FormControl, ControlLabel, HelpBlock,
    Button, Checkbox, Panel, Image
} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import axios from 'axios';
import queryString from 'query-string';
import settings from '../settings';
import errors from '../components/Errors';
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
            voterNr: '',
            caretakerName: '',
            caretakerDocId: '',
            photoSrc: null,
            comments: '',
            editable: edit,
            caretakerId: null,
            isEditSuccess: null
        };
    }

    componentDidMount() {
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
                    birth: new Date(person.Birthdate),
                    docId: person.IdCardNr,
                    gender: person.Gender,
                    isResident: voterNr ? true : false,
                    voterNr: voterNr,
                    phoneNr: caretaker && caretaker.Phone ? caretaker.Phone : (person.Phone ? person.Phone : ''),
                    email: caretaker && caretaker.Email ? caretaker.Email : (person.Email ? person.Email : ''),
                    caretakerId: player.CaretakerId,
                    caretakerName: caretaker ? caretaker.Name : '',
                    caretakerDocId: caretaker ? caretaker.IdCardNr : '',
                    comments: player.Comments,
                    stepDescr: player.step.Description,
                    steps: [player.step],
                    photoSrc: photo
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
        this.setState({ editable: true, isEditSuccess: null });
    }

    validateForm() {
        let result = true;
        const { playerName, docId, gender, birth, caretakerName, caretakerDocId } = this.state;
        result = result && 
            playerName && playerName !== '' &&
            docId && docId !== '' &&
            gender && gender !== '' &&
            birth && birth !== '';

        result = result && 
            caretakerName && caretakerName !== '' &&
            caretakerDocId && caretakerDocId !== '';
        return result;
    }

    handleSubmit(evt) {
        if (this.validateForm()) {
            const { season, teamId, stepId, personId, playerId } = this.state;
            const caretakerRequired = isCaretakerRequired(this.state.steps, this.state.stepId);
            if (personId !== null) {
                console.log('Submitting player...');
                const data = {
                    player: {
                        roleId: this.state.roleId,
                        comments: this.state.comments,
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
                        photo: this.state.photoSrc
                    },
                    caretaker: {
                        id: this.state.caretakerId,
                        name: this.state.caretakerName,
                        docId: this.state.caretakerDocId,
                        email: caretakerRequired ? this.state.email : null,
                        phoneNr: caretakerRequired ? this.state.phoneNr : null,
                        voterNr: this.state.isResident && caretakerRequired ? this.state.voterNr : null
                    }
                };
                const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + playerId;
                axios.patch(url, data)
                    .then(result => {
                        console.log(result);
                        this.fetchPlayer();
                        this.setState({ editable: false, isEditSuccess: true });
                        //this.props.history.push('/seasons/' + season + '/steps/' + stepId + '/players/' + playerId + '?success');
                        // if (result.data && result.data.length > 0) {
                        //     this.setState({ data: result.data });
                        // }
                    })
                    .catch((err) => {
                        const errMsgs = { e409: 'Jogador já está inscrito no escalão escolhido.' };
                        errors.handleError(err, errMsgs);
                    });
            }
        }
        evt.preventDefault();
    }

    handleCancel() {
        this.fetchPlayer();
        this.setState({ editable: false });
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
                    self.setState({ photoSrc: e.target.result });
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

    onChangeBirthdate = date => this.setState({ birth: date })

    render() {
        const title = this.state.editable ? "Editar Jogador" : "Ficha de Jogador"

        const formDetails = this.state.playerId ?
            <FormPlayer {...this.state}
                onChangeBirthdate={this.onChangeBirthdate}
                handleControlChange={this.handleControlChange.bind(this)}
                handleCheckboxToggle={this.handleCheckboxToggle.bind(this)}
                handleGenderSelect={this.handleGenderSelect.bind(this)}
                handlePhoto={this.handlePhoto.bind(this)}
                handleEdit={this.handleEdit.bind(this)} /> :
            <div />;

        return (
            <div>
                {this.state.isEditSuccess ?
                    <Alert bsStyle="success">
                        <strong>Jogador alterado com sucesso.</strong>
                    </Alert> : ''}
                <h2>{title}</h2>
                <form>
                    {formDetails}
                    {this.state.editable ?
                        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <Button bsStyle="primary" onClick={this.handleCancel} style={{ margin: '3px' }}>Cancelar</Button>
                            <Button bsStyle="primary" type="submit" onClick={this.handleSubmit} style={{ margin: '3px' }}>Confirmar</Button>
                        </div> :
                        ''}
                </form>
            </div>
        );
    }
}

function FormPlayer(props) {
    const caretakerRequired = isCaretakerRequired(props.steps, props.stepId);
    //console.log('Caretaker required: ', caretakerRequired);

    const validateEmail = () => {
        if (props.email !== '' && !props.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) return 'error';
        return null;
    };

    const validatePhone = () => {
        if (props.phoneNr !== '' && !props.phoneNr.replace(/ /g, '').match(/^(\+351|00351|351)?(9[1236][0-9]{7}|2[1-9][0-9]{7})$/)) return 'error';
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
                readOnly={!props.editable}
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
                readOnly={!props.editable}
                validationState={validatePhone}
            />
            <Checkbox checked={props.isResident} readOnly={!props.editable}
                name="isResident" onChange={props.handleCheckboxToggle} >
                <span style={{ fontWeight: '700' }}>Residente na freguesia?</span>
            </Checkbox>
            {props.isResident ?
                <FieldGroup
                    id="formVoterNr"
                    type="text"
                    name="voterNr"
                    label={caretakerRequired ? "Nr de Eleitor do Responsável" : "Nr de Eleitor"}
                    placeholder={caretakerRequired ? "Nr de Eleitor do Responsável" : "Nr de Eleitor"}
                    value={props.voterNr}
                    onChange={props.handleControlChange}
                    readOnly={!props.editable}
                /> : ''}
            {props.isResident && props.editable ?
                <Fragment>
                    Se não sabe o Nr de Eleitor pode obtê-lo aqui:
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
                    readOnly={!props.editable}
                />
                <FieldGroup
                    id="formCaretakerIdCard"
                    type="text"
                    name="caretakerDocId"
                    label="Nr Cartão Cidadão do Responsável"
                    placeholder="Nr Cartão Cidadão do Responsável"
                    value={props.caretakerDocId}
                    onChange={props.handleControlChange}
                    readOnly={!props.editable}
                />
                {commonFields}
            </Panel.Body>
        </Panel> :
        <div />;

    const photoUploader = props.editable ?
        <div className="column">
            <FieldGroup
                id="formFoto"
                type="file"
                label="Fotografia"
                help="Digitalização de Fotografia do Jogador"
                onChange={props.handlePhoto}
                readOnly={!props.editable}
                accept="image/*"
            /></div> : '';

    const editButton = props.editable || props.editable === null ? '' :
        <div className="column" style={{ float: 'right' }}>
            <Button bsStyle="primary" onClick={props.handleEdit}>Editar</Button>
        </div>;

    return (<div>
        <div style={{ display: 'flex', maxHeight: '200px' }}>
            <Image id="photoThumb" thumbnail src={props.photoSrc ? props.photoSrc : '/no_image.jpg'}
                className="column"
                style={{ maxWidth: "200px", display: props.photoSrc === null ? 'none' : 'inline' }} />
            {photoUploader}
            {editButton}
        </div>
        <FieldGroup
            id="formName"
            type="text"
            name="playerName"
            label="Nome do Jogador"
            placeholder="Nome do Jogador"
            value={props.playerName}
            onChange={props.handleControlChange}
            readOnly={!props.editable}
        />
        <FieldGroup
            id="formIdCard"
            type="text"
            name="docId"
            label="Nr Cartão Cidadão do Jogador"
            placeholder="Nr Cartão Cidadão do Jogador"
            value={props.docId}
            onChange={props.handleControlChange}
            readOnly={true}
        />
        <FormGroup controlId="formBirthdate">
            <ControlLabel>Data Nascimento do Jogador</ControlLabel>
            <div>
                <DatePicker onChange={props.onChangeBirthdate} value={props.birth}
                    required={true} locale="pt-PT" disabled={!props.editable}
                    calendarClassName="date-picker-form-control" />
            </div>
        </FormGroup>

        <FormGroup controlId="selectGender">
            <ControlLabel>Género</ControlLabel>
            <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                onChange={props.handleGenderSelect} value={props.gender}
                disabled={!props.editable}>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
            </FormControl>
            <FormControl.Feedback />
        </FormGroup>
        {caretakerCtrls}
        {caretakerRequired ? <div /> : commonFields}
        <FormGroup controlId="formComments">
            <ControlLabel>Notas Adicionais</ControlLabel>
            <FormControl componentClass="textarea" placeholder="Notas"
                name="comments" value={props.comments} onChange={props.handleControlChange}
                readOnly={!props.editable} />
        </FormGroup>
    </div>);
}

function isCaretakerRequired(steps, stepId) {
    // console.log('Steps: ', steps);
    // console.log('StepId: ', stepId);
    const filter = steps.filter(s => s.Id == stepId);
    //console.log(filter);
    const result = filter.length > 0 && filter[0].IsCaretakerRequired;
    return result;
}

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id} validationState={props.validationState ? props.validationState() : null}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            <FormControl.Feedback />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}