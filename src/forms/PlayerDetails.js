import React, { Component, Fragment } from 'react';
import {
    FormGroup, FormControl, ControlLabel, HelpBlock,
    Button, Panel, Image
} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import axios from 'axios';
import settings from '../settings';
import errors from '../components/Errors';
import '../styles/PlayerForm.css'

export default class PlayerDetails extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.fetchPlayer = this.fetchPlayer.bind(this);
        
        const stepId = props.match.params.stepId;
        const playerId = props.match.params.playerId

        this.state = {
            season: props.match.params.year,
            teamId: props.teamId,
            stepId: stepId,
            stepDescr: '',
            playerId: playerId,
            personId: null,
            roleId: null,
            name: '',
            gender: '',
            birth: null,
            docId: '',
            phoneNr: '',
            email: '',
            voterNr: '',
            caretakerName: '',
            caretakerDocId: '',
            photoSrc: null,
            comments: '',
            editable: null,
            caretakerId: null
        };
    }

    componentDidMount() {
        this.fetchPlayer();        
    }

    fetchPlayer() {
        const { season, teamId, stepId, playerId } = this.state;

        const url = settings.API_URL + '/api/seasons/'+season+'/teams/'+teamId+'/steps/'+stepId+'/players/'+playerId;
        axios.get(url)
            .then(results => {
                const { player, photo } = results.data;
                this.setState({ 
                    roleId: player.RoleId,
                    name: player.Name,
                    birth: new Date(player.person.Birthdate),
                    docId: player.IdCardNr,
                    gender: player.person.Gender,
                    voterNr: player.VoterNr,
                    phoneNr: player.Phone,
                    email: player.Email,
                    caretakerId: player.CaretakerId,
                    stepDescr: player.step.Description,
                    photoSrc: photo,
                    editable: false
                 });
            })
            .catch(errors.handleError);
    }

    handleGenderSelect(evt) {
        this.setState({ gender: evt.target.value });
    }

    handleControlChange(evt) {
        //console.log(evt);
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    handleEdit() {
        this.setState({ editable: true });
    }

    handleSubmit(evt) {
        const { season, teamId, stepId, personId } = this.state;
        const caretakerRequired = isCaretakerRequired(this.state.steps, this.state.stepId);
        if (personId !== null) {
            console.log('Submitting player...');
            const data = {
                role: this.state.role,
                person: {
                    id: this.state.personId,
                    name: this.state.name,
                    docId: this.state.docId,
                    gender: this.state.gender,
                    birth: this.state.birth,
                    email: caretakerRequired ? null : this.state.email,
                    phoneNr: caretakerRequired ? null : this.state.phoneNr,
                    voterNr: caretakerRequired ? null : this.state.voterNr,
                    photo: this.state.photoSrc
                },
                caretaker: {
                    name: this.state.caretakerName,
                    docId: this.state.caretakerDocId,
                    email: caretakerRequired ? this.state.email : null,
                    phoneNr: caretakerRequired ? this.state.phoneNr : null,
                    voterNr: caretakerRequired ? this.state.voterNr : null
                },
                comments: this.state.comments
            };
            const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players';
            axios.put(url, data)
                .then(result => {
                    console.log(result);
                    const playerId = result.data.Id;
                    this.props.history.push('/seasons/' + season + '/steps/' + stepId + '/players/' + playerId + '?success');
                    // if (result.data && result.data.length > 0) {
                    //     this.setState({ data: result.data });
                    // }
                })
                .catch((err) => {
                    const errMsgs = { e409: 'Jogador já está inscrito no escalão escolhido.' };
                    errors.handleError(err, errMsgs);
                });
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
                            birth: person.Birthdate,
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
                handleGenderSelect={this.handleGenderSelect.bind(this)}
                handlePhoto={this.handlePhoto.bind(this)}
                handleEdit={this.handleEdit.bind(this)} /> :
            <div />;

        return (
            <div>
                <h2>{title}</h2>
                <form>
                    {formDetails}
                    { this.state.editable ? 
                        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <Button bsStyle="primary" onClick={this.handleCancel} style={{ margin: '3px'}}>Cancelar</Button>
                            <Button bsStyle="primary" type="submit" onClick={this.handleSubmit} style={{ margin: '3px'}}>Confirmar</Button>
                        </div> :
                        ''}
                </form>
            </div>
        );
    }
}

function FormPlayer(props) {
    const caretakerRequired = props.caretakerId ? true : false; //isCaretakerRequired(props.steps, props.stepId);

    const commonFields =
        <Fragment>
            <FieldGroup
                id="formEmail"
                type="email"
                name="email"
                label={caretakerRequired ? "Email do Encarregado de Educação" : "Email"}
                placeholder={caretakerRequired ? "Email do Encarregado de Educação" : "Email"}
                value={props.email}
                onChange={props.handleControlChange}
                readOnly={!props.editable}
            />
            <FieldGroup
                id="formPhone"
                type="text"
                name="phoneNr"
                label={caretakerRequired ? "Telefone do Encarregado de Educação" : "Telefone"}
                placeholder={caretakerRequired ? "Telefone do Encarregado de Educação" : "Telefone"}
                value={props.phoneNr}
                onChange={props.handleControlChange}
                readOnly={!props.editable}
            />
            <FieldGroup
                id="formVoterNr"
                type="text"
                name="voterNr"
                label={caretakerRequired ? "Nr de Eleitor do Encarregado de Educação" : "Nr de Eleitor"}
                placeholder={caretakerRequired ? "Nr do Eleitor do Encarregado de Educação" : "Nr de Eleitor"}
                value={props.voterNr}
                onChange={props.handleControlChange}
                readOnly={!props.editable}
            />
        </Fragment>;

    const caretakerCtrls = caretakerRequired ?
        <Panel>
            <Panel.Heading>
                <Panel.Title componentClass="h3">Dados do Encarregado de Educação</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                <FieldGroup
                    id="formCaretakerName"
                    type="text"
                    name="caretakerName"
                    label="Nome da Mãe/Pai"
                    placeholder="Nome da Mãe/Pai"
                    value={props.caretakerName}
                    onChange={props.handleControlChange}
                    readOnly={!props.editable}
                />
                <FieldGroup
                    id="formCaretakerIdCard"
                    type="text"
                    name="caretakerDocId"
                    label="Nr Cartão Cidadão da Mãe/Pai"
                    placeholder="Nr Cartão Cidadão da Mãe/Pai"
                    onChange={props.handleControlChange}
                    readOnly={!props.editable}
                />
                {commonFields}
            </Panel.Body>
        </Panel> :
        <div />;

    return (<div>
        <div>
            <Image id="photoThumb" thumbnail src={props.photoSrc ? props.photoSrc : '/logo.png'} 
                style={{maxWidth: "200px", display: props.photoSrc === null ? 'none' : 'inline' }}/>
            { props.editable ? 
                <FieldGroup
                    id="formFoto"
                    type="file"
                    label="Fotografia"
                    help="Digitalização de Fotografia do Jogador"
                    onChange={props.handlePhoto}
                    readOnly={!props.editable}
                    accept="image/*"
                /> : (props.editable === null ? '' :
                    <Button bsStyle="primary" onClick={props.handleEdit} style={{ float: 'right' }}>Editar</Button>) }
        </div>
        <FieldGroup
            id="formName"
            type="text"
            name="name"
            label="Nome do Jogador"
            placeholder="Nome do Jogador"
            value={props.name}
            onChange={props.handleControlChange}
            readOnly={!props.editable}
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
            <ControlLabel>Sexo</ControlLabel>
            <FormControl componentClass="select" placeholder="select" style={{ width: 200 }}
                onChange={props.handleGenderSelect} value={props.gender} 
                readOnly={!props.editable}>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
            </FormControl>
            <FormControl.Feedback />
        </FormGroup>
        {caretakerCtrls}
        {caretakerRequired ? <div /> : commonFields}
        <FieldGroup
            id="formComments"
            type="text"
            name="comments"
            label="Notas Adicionais"
            placeholder="Notas"
            value={props.comments}
            onChange={props.handleControlChange}
            readOnly={!props.editable}
        />
    </div>);
}

function isCaretakerRequired(steps, stepId) {
    // console.log('Steps: ', steps);
    // console.log('StepId: ', stepId);
    const filter = steps.filter(s => s.id == stepId);
    //console.log(filter);
    const result = filter[0].isCaretakerRequired;
    return result;
}

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}