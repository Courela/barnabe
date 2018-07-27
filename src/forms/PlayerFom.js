import React, { Component, Fragment } from 'react';
import {
    FormGroup, FormControl, ControlLabel,
    Button, Panel, Image, Checkbox
} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import axios from 'axios';
import settings from '../settings';
import errors from '../components/Errors';
import '../styles/PlayerForm.css'
import { validateNotEmpty, isValidEmail, isValidPhone } from '../utils/validations';
import { FieldGroup } from '../utils/controls';

export default class PlayerForm extends Component {
    constructor(props, context) {
        super(props, context);

        this.getSteps = this.getSteps.bind(this);
        this.getRoles = this.getRoles.bind(this);
        //this.handleStepSelect = this.handleStepSelect.bind(this);
        this.validateStep = this.validateStep.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //this.getGender = this.getGender.bind(this);

        const stepId = props.match.params.stepId;

        this.state = {
            steps: [],
            roles: [],
            season: props.match.params.year,
            teamId: props.teamId,
            stepId: stepId,
            personId: null,
            roleId: '',
            name: '',
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
            doc: null,
            isSubmitting: false
        };
    }

    componentDidMount() {
        this.getSteps();
        this.getRoles();
    }

    getSteps() {
        const year = this.props.match.params.year;
        const teamId = this.props.teamId;

        if (this.state.stepId > 0) {
            const url = settings.API_URL + '/api/seasons/' + this.state.season + '/steps/' + this.state.stepId;
            axios.get(url)
                .then(results => {
                    const single = results.data;
                    //console.log(single);
                    const steps = [single].map(s => ({
                        id: s.Id,
                        descr: s.Description,
                        gender: s.Gender,
                        isCaretakerRequired: s.IsCaretakerRequired,
                        minDate: s.MinDate,
                        maxDate: s.MaxDate
                    }));
                    this.setState({
                        steps: steps,
                        gender: steps[0].gender
                    });
                })
                .catch(errors.handleError);
        }
        else {
            const url = settings.API_URL + '/api/seasons/' + year + '/teams/' + teamId + '/steps';
            axios.get(url)
                .then(results => {
                    if (this.state.stepId > 0) {
                        const single = results.data.filter((s => s.Id == this.state.stepId));
                        const steps = single.map(s => ({
                            id: s.Id,
                            descr: s.Description,
                            gender: s.Gender,
                            isCaretakerRequired: s.IsCaretakerRequired,
                            minDate: s.MinDate,
                            maxDate: s.MaxDate
                        }));
                        //console.log(single);
                        this.setState({
                            steps: steps,
                            gender: steps[0].gender
                        });
                    }
                    else {
                        this.setState({
                            steps: results.data.map(s => ({
                                id: s.Id,
                                descr: s.Description,
                                gender: s.Gender,
                                isCaretakerRequired: s.IsCaretakerRequired
                            }))
                        });
                    }
                })
                .catch(errors.handleError);
        }
    }

    getRoles() {
        const isStaff = this.props.location.pathname.includes('staff');
        const url = settings.API_URL + '/api/roles';
        axios.get(url)
            .then(results => {
                //console.log('Roles: ');
                //console.log(results);
                if (isStaff) {
                    results.data.splice(results.data.indexOf(results.data.find(r => r.Id == 1)), 1);
                }

                if (this.props.roleId) {
                    const single = results.data.filter((r => r.Id == this.props.roleId));
                    const roles = single.map(r => ({
                        id: r.Id,
                        descr: r.Description
                    }));
                    //console.log(single);
                    this.setState({
                        roles: roles,
                        roleId: roles[0].id
                    });
                }
                else {
                    const roles = results.data.map(r => ({
                        id: r.Id,
                        descr: r.Description
                    }));
                    this.setState({ roles: roles });
                }
            })
            .catch(errors.handleError);
    }

    handleStepSelect(evt) {
        this.setState({ stepId: evt.target.value });
    }

    handleGenderSelect(evt) {
        this.setState({ gender: evt.target.value });
    }

    handleRoleSelect(evt) {
        this.setState({ roleId: evt.target.value });
    }

    handleControlChange(evt) {
        //console.log(evt);
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    handleCheckboxToggle(evt) {
        let fieldName = evt.target.name;
        //console.log(fieldName, fieldVal);
        this.setState({ [fieldName]: !this.state[fieldName] });
    }

    validateStep() {
        if (this.state.stepId <= 0) return 'error';
        return null;
    }

    validateGender() {
        if (this.state.gender === null) return 'error';
        return null;
    }

    validateRole() {
        if (this.state.roleId === null || this.state.roleId === '') return 'error';
        return null;
    }

    validateForm() {
        let result = true;
        const { name, docId, gender, birth, email, phoneNr, caretakerName, caretakerDocId } = this.state;
        result = result &&
            name && name !== '' &&
            docId && docId !== '' &&
            gender && gender !== '' &&
            birth && birth !== '' &&
            isValidEmail(email) && isValidPhone(phoneNr);

        if (isCaretakerRequired(this.state.steps, this.state.stepId, this.state.roleId)) {
            result = result &&
                caretakerName && caretakerName !== '' &&
                caretakerDocId && caretakerDocId !== '';
        }
        return result;
    }

    handleSubmit(evt) {

        const { season, teamId, stepId, personId } = this.state;
        const caretakerRequired = isCaretakerRequired(this.state.steps, this.state.stepId, this.state.roleId);
        if (personId !== null) {
            if (this.validateForm()) {
                console.log('Submitting player...');
                this.setState({ isSubmitting: true }, () => {
                    const data = {
                        role: this.state.roleId,
                        photo: this.state.photoSrc,
                        person: {
                            id: this.state.personId,
                            name: this.state.name,
                            docId: this.state.docId,
                            gender: this.state.gender,
                            birth: this.state.birth,
                            email: caretakerRequired ? null : this.state.email,
                            phoneNr: caretakerRequired ? null : this.state.phoneNr,
                            voterNr: caretakerRequired ? null : this.state.voterNr
                        },
                        caretaker: {
                            name: this.state.caretakerName,
                            docId: this.state.caretakerDocId,
                            email: caretakerRequired ? this.state.email : null,
                            phoneNr: caretakerRequired ? this.state.phoneNr : null,
                            voterNr: caretakerRequired ? this.state.voterNr : null
                        },
                        comments: this.state.comments,
                        doc: this.state.doc
                    };
                    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players';
                    axios.put(url, data)
                        .then(result => {
                            console.log(result);
                            const playerId = result.data.Id;
                            this.props.history.push('/seasons/' + season + '/steps/' + stepId + '/players/' + playerId);
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
            else {
                alert('Campos obrigatórios em falta!');
            }
        }
        else {
            console.log('Search person with docId ' + this.state.docId);
            axios.get(settings.API_URL + '/api/persons?docId=' + this.state.docId)
                .then(result => {
                    const person = result.data;
                    console.log('Person result: ' + JSON.stringify(person));
                    if (person.Id) {
                        console.log('Set personId: ' + person.Id);
                        this.setState({
                            personId: person.Id,
                            name: person.Name,
                            email: person.Email ? person.Email : '',
                            phoneNr: person.Phone ? person.Phone : '',
                            birth: person.Birthdate ? new Date(person.Birthdate) : null,
                            voterNr: person.VoterNr
                        });
                    } else {
                        console.log('No person found');
                        this.setState({ personId: 0 });
                    }
                })
                .catch(errors.handleError);
        }
        evt.preventDefault();
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

    handleDoc(evt) {
        var files = evt.target.files; // FileList object

        let self = this;
        const onload = function (theFile) {
            return function (e) {
                self.setState({ doc: reader.result });
                //self.setState({ doc: window.btoa(reader.result) });
            };
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
        const selectSteps = this.state.steps.map((s) => <option key={s.id} value={s.id}>{s.descr}</option>);

        const formDetails = this.state.personId !== null ?
            <PlayerDetails {...this.state}
                onChangeBirthdate={this.onChangeBirthdate}
                handleControlChange={this.handleControlChange.bind(this)}
                handleCheckboxToggle={this.handleCheckboxToggle.bind(this)}
                handleGenderSelect={this.handleGenderSelect.bind(this)}
                handleRoleSelect={this.handleRoleSelect.bind(this)}
                validateGender={this.validateGender.bind(this)}
                validateRole={this.validateRole.bind(this)}
                handlePhoto={this.handlePhoto.bind(this)}
                handleDoc={this.handleDoc.bind(this)} /> :
            <div />;

        const submitLabel = this.state.personId ? "Inscrever" : "Continuar"

        return (
            <div>
                <h2>Adicionar</h2>
                <form>
                    <FormGroup controlId="selectStep" validationState={this.validateStep()}>
                        <ControlLabel>Escalão</ControlLabel>
                        <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                            onChange={this.handleStepSelect.bind(this)} value={this.state.stepId}
                            disabled={this.state.steps.length <= 1 && this.state.stepId != 0}>
                            <option value="0">Escolha...</option>
                            {selectSteps}
                        </FormControl>
                        <FormControl.Feedback />
                    </FormGroup>
                    <FieldGroup
                        id="formIdCard"
                        type="text"
                        name="docId"
                        label="Nr Cartão Cidadão do Jogador"
                        placeholder="CC"
                        onChange={this.handleControlChange.bind(this)}
                        validationState={validateNotEmpty}
                        validationArgs={this.state.docId}
                    />
                    {formDetails}
                    <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}
                        disabled={this.state.isSubmitting}>
                        {submitLabel}
                    </Button>
                    <span style={{ display: this.state.isSubmitting ? 'inline' : 'none' }}><img src="/show_loader.gif" alt="" style={{ height: '40px', width: '40px' }} /></span>
                </form>
            </div>
        );
    }
}

function PlayerDetails(props) {
    const caretakerRequired = isCaretakerRequired(props.steps, props.stepId, props.roleId);

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
                validationState={validateEmail}
                validationArgs={[]}
            />
            <FieldGroup
                id="formPhone"
                type="text"
                name="phoneNr"
                label={caretakerRequired ? "Telefone do Responsável" : "Telefone"}
                placeholder={caretakerRequired ? "Telefone do Responsável" : "Telefone"}
                value={props.phoneNr}
                onChange={props.handleControlChange}
                validationState={validatePhone}
                validationArgs={[]}
            />
            {props.roleId ?
                <Checkbox checked={props.isResident}
                    name="isResident" onChange={props.handleCheckboxToggle} >
                    <span style={{ fontWeight: '700' }}>Residente na freguesia?</span>
                </Checkbox> : ''}
            {props.isResident ?
                <Fragment>
                    <FieldGroup
                        id="formVoterNr"
                        type="text"
                        name="voterNr"
                        label={caretakerRequired ? "Nr de Eleitor do Responsável" : "Nr de Eleitor"}
                        placeholder={caretakerRequired ? "Nr de Eleitor do Responsável" : "Nr de Eleitor"}
                        value={props.voterNr}
                        onChange={props.handleControlChange}
                    />
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
                    validationState={validateNotEmpty}
                    validationArgs={props.caretakerName}
                />
                <FieldGroup
                    id="formCaretakerIdCard"
                    type="text"
                    name="caretakerDocId"
                    label="Nr Cartão Cidadão do Responsável"
                    placeholder="Nr Cartão Cidadão do Responsável"
                    value={props.caretakerDocId}
                    onChange={props.handleControlChange}
                    validationState={validateNotEmpty}
                    validationArgs={props.caretakerDocId}
                />
                {commonFields}
            </Panel.Body>
        </Panel> :
        <div />;

    const selectRoles = props.roles.map((r) => <option key={r.id} value={r.id}>{r.descr}</option>);

    const getStepDate = (prop, defaultDate) => {
        //console.log('Date: ', prop, defaultDate);
        let result = defaultDate;
        if (props.roleId == 1) {
            const step = props.steps.find((s) => s.id == props.stepId);
            if (step) {
                result = new Date(step[prop]);
            }
        }
        //console.log('Date result: ', result);
        return result;
    };

    return (<div>
        <FormGroup controlId="selectRole" validationState={props.validateRole()}>
            <ControlLabel>Função</ControlLabel>
            <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                onChange={props.handleRoleSelect} value={props.roleId}
                disabled={props.roles.length <= 1 && props.roleId != ''}>
                <option value="0">Escolha...</option>
                {selectRoles}
            </FormControl>
            <FormControl.Feedback />
        </FormGroup>
        <FieldGroup
            id="formName"
            type="text"
            name="name"
            label="Nome do Jogador"
            placeholder="Nome do Jogador"
            value={props.name}
            onChange={props.handleControlChange}
            validationState={validateNotEmpty}
            validationArgs={props.name}
        />
        <FormGroup controlId="formBirthdate">
            <ControlLabel>Data Nascimento do Jogador</ControlLabel>
            <div>
                <DatePicker onChange={props.onChangeBirthdate} value={props.birth}
                    required={true} locale="pt-PT"
                    minDate={getStepDate('minDate', new Date('1900-01-01T00:00:00.000Z'))}
                    maxDate={getStepDate('maxDate', new Date())}
                    calendarClassName="date-picker-form-control" />
            </div>
        </FormGroup>

        <FormGroup controlId="selectGender" validationState={props.validateGender()}>
            <ControlLabel>Género</ControlLabel>
            <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                onChange={props.handleGenderSelect} value={props.gender}>
                <option value="0">Escolha...</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
            </FormControl>
            <FormControl.Feedback />
        </FormGroup>
        <FieldGroup
            id="formFoto"
            type="file"
            label="Fotografia"
            help="Digitalização de Fotografia do Jogador"
            onChange={props.handlePhoto}
            accept="image/*"
        />
        <Image id="photoThumb" thumbnail src={props.photoSrc}
            style={{ maxWidth: "200px", display: props.photoSrc === null ? 'none' : 'block' }} />
        {props.roleId == 1 ?
            <FieldGroup
                id="formDoc"
                type="file"
                label="Ficha individual de jogador"
                help="Ficha individual de jogador"
                onChange={props.handleDoc}
                accept="image/*,application/pdf"
            /> : ''}
        {caretakerCtrls}
        {caretakerRequired ? <div /> : commonFields}
        <FormGroup controlId="formComments">
            <ControlLabel>Notas Adicionais</ControlLabel>
            <FormControl componentClass="textarea" placeholder="Notas"
                name="comments" value={props.comments}
                onChange={props.handleControlChange} />
        </FormGroup>
    </div>);
}

function isCaretakerRequired(steps, stepId, roleId) {
    // console.log('Steps: ', steps);
    // console.log('StepId: ', stepId);
    let result = false;
    if (roleId && roleId == 1) {
        const filter = steps.filter(s => s.id == stepId);
        //console.log(filter);
        result = filter[0].isCaretakerRequired;
    }
    return result;
}
