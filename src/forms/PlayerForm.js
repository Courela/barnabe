import React, { Component, Fragment } from 'react';
import {
    FormGroup, FormControl, ControlLabel,
    Button, Panel, Image, Checkbox
} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import errors from '../components/Errors';
import '../styles/PlayerForm.css'
import { validateNotEmpty, isValidEmail, isValidPhone, 
    isCaretakerRequired } from '../utils/validations';
import { FieldGroup } from '../utils/controls';
import { getRoles, getTeamSteps, getStep, getPerson, createPlayer } from '../utils/communications';

export default class PlayerForm extends Component {
    constructor(props, context) {
        super(props, context);

        this.getSteps = this.getSteps.bind(this);
        this.getRoles = this.getRoles.bind(this);
        this.validateStep = this.validateStep.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleReset = this.handleReset.bind(this);

        const stepId = props.match.params.stepId && !isNaN(props.match.params.stepId) ? 
            props.match.params.stepId : 
            !isNaN(props.stepId) ? 
                parseInt(props.stepId, 10) : props.stepId;

        this.state = {
            steps: [],
            roles: [],
            season: props.match.params.year || props.season,
            teamId: props.teamId,
            stepId: stepId,
            personId: null,
            roleId: 0,
            name: '',
            gender: '',
            birth: null,
            docId: '',
            phoneNr: '',
            email: '',
            isResident: false,
            isLocalBorn: false,
            isLocalTown: false,
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
        const year = this.props.match.params.year || this.props.season;
        const teamId = this.props.teamId;

        if (this.state.stepId > 0) {
            getStep(this.state.stepId, this.state.season)
                .then(step => {
                    this.setState({
                        steps: Array(1).fill(step),
                        gender: step.gender
                    });
                })
                .catch(errors.handleError);
        }
        else {
            getTeamSteps(year, teamId)
                .then(steps => {
                    if (this.state.stepId > 0) {
                        const single = steps.filter((s => s.id === this.state.stepId));
                        this.setState({
                            steps: single,
                            gender: single[0].gender
                        });
                    }
                    else {
                        if (steps.length > 1) {
                            this.setState({
                                steps: steps
                            });
                        } else {
                            this.setState({
                                steps: steps,
                                stepId: steps[0].id,
                                gender: steps[0].gender
                            });
                        }
                    }
                })
                .catch(errors.handleError);
        }
    }

    getRoles() {
        const isStaff = this.props.location.pathname.includes('staff');
        getRoles()
            .then(roles => {
                if (isStaff) {
                    roles.splice(roles.indexOf(roles.find(r => r.id === 1)), 1);
                }

                if (this.props.roleId > 0) {
                    const singleRole = roles.filter(r => r.id === this.props.roleId);
                    this.setState({
                        roles: singleRole,
                        roleId: singleRole[0].id
                    });
                }
                else {
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
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    handleCheckboxToggle(evt) {
        let fieldName = evt.target.name;
        this.setState({ [fieldName]: !this.state[fieldName] });
    }

    validateStep() {
        if (!this.state.stepId || this.state.stepId <= 0) return 'error';
        return null;
    }

    validateGender() {
        if (this.state.gender === null) return 'error';
        return null;
    }

    validateRole() {
        if (this.state.roleId === null || this.state.roleId > 0) return 'error';
        return null;
    }

    validateForm() {
        let result = true;
        const { name, docId, gender, birth, email, phoneNr, caretakerName, caretakerDocId, steps, stepId, roleId } = this.state;
        result = result &&
            name && name !== '' &&
            docId && docId !== '' &&
            gender && gender !== '' &&
            birth && birth !== '' &&
            isValidEmail(email) && isValidPhone(phoneNr);
        
        if (isCaretakerRequired(steps, stepId, roleId, birth, this.props.eighteenDate)) {
            result = result &&
                caretakerName && caretakerName !== '' &&
                caretakerDocId && caretakerDocId !== '';
        }
        return result;
    }

    handleSubmit(evt) {
        const { season, teamId, stepId, personId, steps, roleId, birth } = this.state;
        const caretakerRequired = isCaretakerRequired(steps, stepId, roleId, birth, this.props.eighteenDate);
        if (personId !== null) {
            if (this.validateForm()) {
                console.log('Submitting player...');
                //console.log('handleSubmit birth: ', this.state.birth);
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
                            voterNr: caretakerRequired ? null : this.state.voterNr,
                            isLocalBorn: this.state.isLocalBorn,
                            isLocalTown: this.state.isLocalTown
                        },
                        caretaker: caretakerRequired ? {
                            name: this.state.caretakerName,
                            docId: this.state.caretakerDocId,
                            email: caretakerRequired ? this.state.email : null,
                            phoneNr: caretakerRequired ? this.state.phoneNr : null,
                            voterNr: caretakerRequired ? this.state.voterNr : null
                        } : null,
                        isResident: this.state.isResident,
                        comments: this.state.comments,
                        doc: this.state.doc
                    };
                    createPlayer(season, teamId, stepId, data)
                        .then(result => {
                            const playerId = result.data.Id;
                            const isAdmin = this.props.location.pathname.includes('admin');
                            this.props.history.push((isAdmin ? '/admin' : '') + '/seasons/' + season + (isAdmin ? '/teams/' + teamId : '') + '/steps/' + stepId + '/players/' + playerId);
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
            getPerson(this.state.docId, true)
                .then(person => {
                    //console.log("PlayerForm getPerson response: ", person);
                    if (person.id) {
                        this.setState({
                            personId: person.id,
                            name: person.name,
                            gender: person.gender,
                            email: person.email ? person.email : (person.caretaker && person.caretaker.email ? person.caretaker.Email : ''),
                            phoneNr: person.phone ? person.phone : (person.caretaker && person.caretaker.phone ? person.caretaker.phone : ''),
                            birth: person.birthdate ? new Date(person.birthdate) : null,
                            voterNr: person.voter_nr,
                            isLocalBorn: person.local_born ? person.local_born : false,
                            isLocalTown: person.local_town ? person.local_town : false,
                            caretakerDocId: person.caretaker ? person.caretaker.id_card_number : '',
                            caretakerName: person.caretaker ? person.caretaker.name : '',
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

    onChangeBirthdate = date => 
    {
        console.log("onChangeBirthdate date: ", date);
        this.setState({ birth: date });
    }

    handleCancel = () => this.props.history.goBack();

    handleReset() {
        this.setState(
            {
                personId: null,
                name: '',
                gender: '',
                birth: null,
                docId: '',
                phoneNr: '',
                email: '',
                isResident: false,
                isLocalBorn: false,
                isLocalTown: false,
                voterNr: '',
                caretakerName: '',
                caretakerDocId: '',
                photoSrc: null,
                comments: '',
                doc: null,
                isSubmitting: false
            }
        );
    }

    render() {
        const selectSteps = this.state.steps.map((s) => <option key={s.id} value={s.id}>{s.description}</option>);

        const formDetails = this.state.personId !== null ?
            <PlayerDetails {...this.state}
                eighteenDate={this.props.eighteenDate}
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

        const submitLabel = this.state.personId != null ? "Inscrever" : "Continuar"

        return (
            <div>
                <h2>Adicionar</h2>
                <form>
                    <FormGroup controlId="selectStep" validationState={this.validateStep()}>
                        <ControlLabel>Escalão</ControlLabel>
                        <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                            onChange={this.handleStepSelect.bind(this)} value={this.state.stepId}
                            disabled={this.state.steps.length <= 1 && this.state.stepId !== 0}>
                            <option value="0">Escolha...</option>
                            {selectSteps}
                        </FormControl>
                        <FormControl.Feedback />
                    </FormGroup>
                    <FieldGroup
                        id="formIdCard"
                        type="text"
                        name="docId"
                        label={"Nr Cartão Cidadão" + (this.state.roleId === 1 ? " do Jogador" : "")}
                        placeholder="CC"
                        onChange={this.handleControlChange.bind(this)}
                        maxLength="30"
                        validationState={validateNotEmpty}
                        validationArgs={this.state.docId}
                        value={this.state.docId}
                        disabled={this.state.personId !== null || this.state.isSubmitting}
                    />
                    {this.state.personId !== null ?
                        <div style={{ display: 'flex', flexDirection: 'row-reverse', padding: '5px' }}> 
                            <Button bsStyle="primary" disabled={this.state.isSubmitting}
                                onClick={this.handleReset} style={{ margin: '3px' }}>Limpar</Button>
                        </div> :
                            ''
                    }
                    {formDetails}
                    <div style={{ display: 'flex', flexDirection: 'row-reverse', padding: '5px' }}>
                        <Button bsStyle="primary" disabled={this.state.isSubmitting}
                            onClick={this.handleCancel} style={{ margin: '3px' }}>Cancelar</Button>
                        <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}
                            disabled={this.state.isSubmitting} style={{ margin: '3px' }}>
                            {submitLabel}
                        </Button>
                        <span style={{ display: this.state.isSubmitting ? 'inline' : 'none' }}><img src="/show_loader.gif" alt="" style={{ height: '40px', width: '40px' }} /></span>
                    </div>
                </form>
            </div>
        );
    }
}

function PlayerDetails(props) {
    const caretakerRequired = isCaretakerRequired(props.steps, props.stepId, props.roleId, props.birth, props.eighteenDate);

    const validateEmail = () => {
        if (props.email && props.email !== '' && !props.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) return 'error';
        return null;
    };

    const validatePhone = () => {
        if (props.phoneNr && props.phoneNr !== '' && !props.phoneNr.replace(/ /g, '').match(/^(\+351|00351|351)?(9[1236][0-9]{7}|2[1-9][0-9]{7})$/)) return 'error';
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
                maxLength="100"
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
                maxLength="16"
                validationState={validatePhone}
                validationArgs={[]}
            />
            {props.roleId && props.roleId === 1 ?
                <Fragment>
                    <Checkbox checked={props.isResident}
                        name="isResident" onChange={props.handleCheckboxToggle} >
                        <span style={{ fontWeight: '700' }}>Residente na freguesia?</span>
                    </Checkbox>
                    Para efeitos de valição do estatuto de residente será usada a morada registada no
                    Cartão do Cidadão (usada para efeitos de votação eleitoral). Pode validar a morada aqui:&nbsp;
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
                    value={props.caretakerName || ''}
                    onChange={props.handleControlChange}
                    maxLength="80"
                    validationState={validateNotEmpty}
                    validationArgs={props.caretakerName}
                />
                <FieldGroup
                    id="formCaretakerIdCard"
                    type="text"
                    name="caretakerDocId"
                    label="Nr Cartão Cidadão do Responsável"
                    placeholder="Nr Cartão Cidadão do Responsável"
                    value={props.caretakerDocId || ''}
                    onChange={props.handleControlChange}
                    maxLength="30"
                    validationState={validateNotEmpty}
                    validationArgs={props.caretakerDocId}
                />
                {commonFields}
            </Panel.Body>
        </Panel> :
        <div />;

    const selectRoles = props.roles.map((r) => <option key={r.id} value={r.id}>{r.description}</option>);

    const getStepDate = (prop, defaultDate) => {
        let result = defaultDate;
        if (props.roleId === 1) {
            const step = props.steps.find((s) => s.id === props.stepId);
            if (step) {
                result = new Date(step[prop]);
            }
        }
        return result;
    };

    return (<div>
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
        <FieldGroup
            id="formName"
            type="text"
            name="name"
            label={props.roleId === 1 ? "Nome do Jogador" : "Nome"}
            placeholder={props.roleId === 1 ? "Nome do Jogador" : "Nome"}
            value={props.name}
            onChange={props.handleControlChange}
            maxLength="80"
            validationState={validateNotEmpty}
            validationArgs={props.name}
        />
        <FormGroup controlId="formBirthdate">
            <ControlLabel>Data Nascimento{props.roleId === 1 ? " do Jogador" : ""}</ControlLabel>
            <div>
                <DatePicker onChange={props.onChangeBirthdate} value={props.birth}
                    required={true} locale="pt-PT"
                    minDate={getStepDate('min_date', new Date('1900-01-01T00:00:00.000Z'))}
                    maxDate={getStepDate('max_date', new Date())}
                    calendarClassName="date-picker-form-control" />
            </div>
        </FormGroup>

        <FormGroup controlId="selectGender" validationState={props.validateGender()}>
            <ControlLabel>Género</ControlLabel>
            <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                onChange={props.handleGenderSelect} value={props.gender}
                disabled={!props.steps || (props.steps.length === 1 && props.steps[0].gender)}>
                <option value="0">Escolha...</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
            </FormControl>
            <FormControl.Feedback />
        </FormGroup>
        {props.roleId && props.roleId === 1 ?
                <Checkbox checked={props.isLocalBorn}
                    name="isLocalBorn" onChange={props.handleCheckboxToggle} >
                    <span style={{ fontWeight: '700' }}>Natural da freguesia (registado como nascido na freguesia) ?</span>
                </Checkbox> : ''}
        {props.roleId && props.roleId === 1 ?
                <Checkbox checked={props.isLocalTown} disabled={!props.isEditing || props.isSubmitting}
                    name="isLocalTown" onChange={props.handleCheckboxToggle} >
                    <span style={{ fontWeight: '700' }}>Residente na freguesia ?</span>
                </Checkbox> : ''}
        <FieldGroup
            id="formFoto"
            type="file"
            label="Fotografia"
            help={"Digitalização de Fotografia" + (props.roleId === 1 ? " do Jogador" : "")}
            onChange={props.handlePhoto}
            accept="image/*"
        />
        <Image id="photoThumb" thumbnail src={props.photoSrc}
            style={{ maxWidth: "200px", display: props.photoSrc === null ? 'none' : 'block' }} />
        {props.roleId === 1 ?
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
                onChange={props.handleControlChange} maxLength="2000" />
        </FormGroup>
    </div>);
}
