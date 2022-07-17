import React, { Component } from 'react';
import { Alert, Button } from 'react-bootstrap';
import queryString from 'query-string';
import FormPlayer from './FormPlayer';
import errors from '../components/Errors';
import { isValidEmail, isValidPhone, isValidDate, isCaretakerRequired } from '../utils/validations';
import { getPlayer, updatePlayer } from '../utils/communications';
import '../styles/PlayerForm.css'

export default class PlayerDetails extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.fetchPlayer = this.fetchPlayer.bind(this);
        this.validateForm = this.validateForm.bind(this);

        const stepId = !isNaN(props.match.params.stepId) ? 
            parseInt(props.match.params.stepId, 10) : null;

        const playerId = props.match.params.playerId;
        const queryStringValues = queryString.parse(this.props.location.search)
        const edit = queryStringValues.edit ? true : false;

        this.state = {
            season: props.match.params.year,
            isSeasonActive: props.isSeasonActive || false,
            teamId: props.teamId,
            stepId: stepId,
            steps: [],
            roles: [],
            playerId: playerId,
            personId: null,
            roleId: null,
            playerName: '',
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

    fetchPlayer() {
        const { season, teamId, stepId, playerId } = this.state;

        getPlayer(season, teamId, stepId, playerId)
            .then(player => {
                // console.log("PlayerDetails getPlayer: ", player);
                const { photo, person, caretaker, role, step } = player;
                const voterNr = caretaker && caretaker.voter_nr ? caretaker.voter_nr : (person && person.voter_nr ? person.voter_nr : '');
                this.setState({
                    personId: person.id,
                    roleId: player.role_id,
                    roles: [role],
                    playerName: person.name,
                    birth: isValidDate(person.birthdate) ? new Date(person.birthdate) : null,
                    idCardNr: person.id_card_number,
                    gender: person.gender,
                    isResident: player.is_resident ? true : false,
                    isLocalBorn: person.local_born ? true : false,
                    isLocalTown: person.local_town ? true : false,
                    voterNr: voterNr,
                    phoneNr: caretaker && caretaker.phone ? caretaker.phone : (person.phone ? person.phone : ''),
                    email: caretaker && caretaker.email ? caretaker.email : (person.email ? person.email : ''),
                    caretakerId: caretaker.Id,
                    caretakerName: caretaker ? caretaker.name : '',
                    caretakerIdCardNr: caretaker ? caretaker.id_card_number : '',
                    comments: player.comments,
                    stepDescr: step.description,
                    steps: [step],
                    photoSrc: photo,
                    newPhotoUpload: false,
                    docExists: player.doc_filename ? true : false,
                    doc: player.doc
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
        this.setState({ [fieldName]: fieldVal });
    }

    handleCheckboxToggle(evt) {
        let fieldName = evt.target.name;
        this.setState({ [fieldName]: !this.state[fieldName] });
    }

    handleEdit() {
        this.setState({ isEditing: true, isEditSuccess: null });
    }

    validateForm() {
        let result = true;
        const { playerName, idCardNr, gender, birth, email, phoneNr, caretakerName, caretakerIdCardNr } = this.state;
        result = result &&
                playerName && playerName !== '' &&
                idCardNr && idCardNr !== '' &&
                isValidEmail(email) && isValidPhone(phoneNr);
                
        if (this.state.roleId === 1) {
            result = result &&
                gender && gender !== '' &&
                birth && birth !== '';

            const { steps, stepId, roleId } = this.state;
            if (isCaretakerRequired(steps, stepId, roleId, birth, this.props.eighteenDate)) {
                result = result &&
                    caretakerName && caretakerName !== '' &&
                    caretakerIdCardNr && caretakerIdCardNr !== '';
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
                    const player = {
                        role_id: this.state.roleId,
                        comments: this.state.comments,
                        photo: this.state.newPhotoUpload ? this.state.photoSrc : null,
                        doc: this.state.doc,
                        is_resident: this.state.isResident,
                        person: {
                            id: this.state.personId,
                            name: this.state.playerName,
                            id_card_number: this.state.idCardNr,
                            gender: this.state.gender,
                            birthdate: this.state.birth,
                            email: caretakerRequired ? null : this.state.email,
                            phone: caretakerRequired ? null : this.state.phoneNr,
                            voter_nr: caretakerRequired || !this.state.isResident ? null : this.state.voterNr,
                            local_born: this.state.isLocalBorn,
                            local_town: this.state.isLocalTown
                        },
                        caretaker: caretakerRequired ? {
                            id: this.state.caretakerId,
                            name: this.state.caretakerName,
                            id_card_number: this.state.caretakerIdCardNr,
                            email: caretakerRequired ? this.state.email : null,
                            phone: caretakerRequired ? this.state.phoneNr : null,
                            voter_nr: this.state.isResident && caretakerRequired ? this.state.voterNr : null
                        } : null
                    };
                    updatePlayer(season, teamId, stepId, playerId, player)
                        .then(() => {
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

    validateRole() {
        if (this.state.roleId === null || this.state.roleId > 0) return 'error';
        return null;
    }

    handleRoleSelect(evt) {
        this.setState({ roleId: evt.target.value });
    }

    onChangeBirthdate = date => this.setState({ birth: date })

    render() {
        const title = this.state.isEditing ? 
            (this.state.roleId === 1 ? "Editar Jogador" : "Editar Elemento Equipa Técnica") : 
            (this.state.roleId === 1 ? "Ficha de Jogador" : "Ficha de Elemento Equipa Técnica");

        return (
            <div>
                {this.state.isEditSuccess ?
                    <Alert bsStyle="success">
                        <strong>{this.state.roleId === 1 ? "Jogador" : "Elemento "} alterado com sucesso.</strong>
                    </Alert> : ''}
                <h2>{title}</h2>
                <form>
                    {this.state.playerId ?
                        <FormPlayer {...this.state}
                            location={this.props.location}
                            onChangeBirthdate={this.onChangeBirthdate}
                            handleControlChange={this.handleControlChange.bind(this)}
                            handleCheckboxToggle={this.handleCheckboxToggle.bind(this)}
                            handleGenderSelect={this.handleGenderSelect.bind(this)}
                            handlePhoto={this.handlePhoto.bind(this)}
                            handleEdit={this.handleEdit.bind(this)}
                            handleDoc={this.handleDoc.bind(this)} 
                            validateRole={this.validateRole.bind(this)}
                            handleRoleSelect={this.handleRoleSelect.bind(this)} /> :
                        <div />}
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
