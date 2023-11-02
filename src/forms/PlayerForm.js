import React, { Component } from 'react';
import {
    FormGroup, FormControl, ControlLabel,
    Button, Image, Checkbox
} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import errors from '../components/Errors';
import '../styles/PlayerForm.css';
import { validateNotEmpty, isValidEmail, isValidPhone, 
    isCaretakerRequired } from '../utils/validations';
import CaretakerForm from './CaretakerForm';
import CommonForm from './CommonForm';
import { FieldGroup } from '../components/Controls';
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
            idCardNr: '',
            phoneNr: '',
            email: '',
            isResident: false,
            isLocalBorn: false,
            isLocalTown: false,
            voterNr: '',
            caretakerName: '',
            caretakerIdCardNr: '',
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
                        } else if (steps.length === 1) {
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

                var roleId = parseInt(this.props.roleId, 10);
                if (roleId > 0) {
                    const singleRole = roles.filter(r => r.id === roleId);
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
        if (this.state.roleId === null || this.state.roleId <= 1) return 'error';
        return null;
    }

    validateForm(isCaretakerRequired) {
        let result = true;
        const { name, idCardNr, gender, birth, email, phoneNr, caretakerName, caretakerIdCardNr, roleId } = this.state;
        result = result &&
            name && name !== '' &&
            idCardNr && idCardNr !== '' &&
            (roleId > 1 || (gender && gender !== '')) &&
            birth && birth !== '' &&
            isValidEmail(email) && isValidPhone(phoneNr);
        
        if (isCaretakerRequired) {
            result = result &&
                caretakerName && caretakerName !== '' &&
                caretakerIdCardNr && caretakerIdCardNr !== '';
        }
        return result;
    }

    handleSubmit(evt) {
        const { season, teamId, stepId, personId, steps, roleId, birth } = this.state;
        const caretakerRequired = isCaretakerRequired(steps, stepId, roleId, birth, this.props.eighteenDate);
        if (personId !== null) {
            if (this.validateForm(caretakerRequired)) {
                console.log('Submitting player...');
                //console.log('handleSubmit birth: ', this.state.birth);
                this.setState({ isSubmitting: true }, () => {
                    const player = {
                        season: season,
                        team_id: teamId,
                        step_id: stepId,
                        role_id: this.state.roleId,
                        person: {
                            id: this.state.personId,
                            name: this.state.name,
                            id_card_number: this.state.idCardNr,
                            gender: this.state.gender,
                            birthdate: this.state.birth,
                            email: caretakerRequired ? null : this.state.email,
                            phone: caretakerRequired ? null : this.state.phoneNr,
                            voter_nr: caretakerRequired ? null : this.state.voterNr,
                            local_born: this.state.isLocalBorn,
                            local_town: this.state.isLocalTown
                        },
                        photo: this.state.photoSrc,
                        caretaker: caretakerRequired ? {
                            name: this.state.caretakerName,
                            id_card_number: this.state.caretakerIdCardNr,
                            email: caretakerRequired ? this.state.email : null,
                            phone: caretakerRequired ? this.state.phoneNr : null,
                            voter_nr: caretakerRequired ? this.state.voterNr : null
                        } : null,
                        is_resident: this.state.isResident,
                        comments: this.state.comments,
                        doc: this.state.doc
                    };
                    createPlayer(season, teamId, stepId, player)
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
            if (this.state.idCardNr) {
                console.log('Search person with idCardNr ' + this.state.idCardNr);
                getPerson(this.state.idCardNr, true)
                    .then(person => {
                        //console.log("PlayerForm getPerson response: ", person);
                        if (person && person.id) {
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
                                caretakerIdCardNr: person.caretaker ? person.caretaker.id_card_number : '',
                                caretakerName: person.caretaker ? person.caretaker.name : '',
                            });
                        } else {
                            console.log('No person found');
                            this.setState({ personId: 0 });
                        }
                    })
                    .catch(errors.handleError);
            } else {
                alert('Campos obrigatórios em falta!');
            }
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
                idCardNr: '',
                phoneNr: '',
                email: '',
                isResident: false,
                isLocalBorn: false,
                isLocalTown: false,
                voterNr: '',
                caretakerName: '',
                caretakerIdCardNr: '',
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
            <Details {...this.state}
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
                        name="idCardNr"
                        label={"Nr Cartão Cidadão" + (this.state.roleId === 1 ? " do Jogador" : "")}
                        placeholder="CC"
                        onChange={this.handleControlChange.bind(this)}
                        maxLength="30"
                        validationState={validateNotEmpty}
                        validationArgs={this.state.idCardNr}
                        value={this.state.idCardNr}
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

function Details(props) {
    const caretakerRequired = isCaretakerRequired(props.steps, props.stepId, props.roleId, props.birth, props.eighteenDate);

    const selectRoles = props.roles.map((r) => <option key={r.id} value={r.id}>{r.description}</option>);

    const getStepDate = (prop, defaultDate) => {
        let result = defaultDate;
        try {
            if (props.roleId === 1) {
                const step = props.steps.find((s) => s.id === props.stepId);
                if (step) {
                    result = new Date(step[prop]);
                }
            }
        } catch (e) {
            console.error(e);
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

        {props.roleId && props.roleId === 1 ?
            <FormGroup controlId="selectGender" validationState={props.validateGender()}>
                <ControlLabel>Género</ControlLabel>
                <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                    onChange={props.handleGenderSelect} value={props.gender || ''}
                    disabled={!props.steps || (props.steps.length === 1 && props.steps[0].gender !== 'X')}>
                    <option value="0">Escolha...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </FormControl>
                <FormControl.Feedback />
            </FormGroup> : '' }
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
        {caretakerRequired ? <CaretakerForm {...props} isEditing={true} /> : <div /> }
        {caretakerRequired ? <div /> : <CommonForm {...props} isEditing={true} caretakerRequired={caretakerRequired} />}
        <FormGroup controlId="formComments">
            <ControlLabel>Notas Adicionais</ControlLabel>
            <FormControl componentClass="textarea" placeholder="Notas"
                name="comments" value={props.comments}
                onChange={props.handleControlChange} maxLength="2000" />
        </FormGroup>
    </div>);
}
