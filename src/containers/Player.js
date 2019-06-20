import React, { Component } from 'react';
import { ButtonToolbar, Button, Image } from 'react-bootstrap';
import errors from '../components/Errors';
import { getPlayer } from '../utils/communications';

export default class Player extends Component {
    constructor(props) {
        super(props);

        this.handleGoBack = this.handleGoBack.bind(this);

        this.state = {
            season: props.match.params.year,
            teamId: props.teamId,
            stepId: props.match.params.stepId,
            playerId: props.match.params.playerId,
            data: {},
            photo: null
        };
    }

    componentDidMount(){
        const { season, teamId, stepId, playerId } = this.state;
        getPlayer(season, teamId, stepId, playerId)
            .then(result => {
                //console.log(result.data);
                this.setState({ 
                    data: result.data.data[0],
                    photo: result.data.photo.toString()
                 });
            })
            .catch(errors.handleError);
    }

    handleGoBack() {
        this.props.history.goBack();
    }

    render() {
        const photo = this.state.photo ? this.state.photo : '/logo.png';
        return (
        <div>
            <h1>Ficha de Jogador</h1>
            <div><Image src={photo} thumbnail style={{ maxHeight: "200px" }} alt="Foto"/></div>
            <div><span>Nome: </span><span>{this.state.data.Name}</span></div>
            <div><span>CC: </span><span>{this.state.data.IdCardNr}</span></div>
            <div><span>Sexo: </span><span>{this.state.data.Gender}</span></div>
            <div><span>Data Nascimento: </span><span>{this.state.data.Birthdate}</span></div>
            <div><span>Escalão: </span><span>{this.state.data.Description}</span></div>
            <div><span>Notas: </span><span>{this.state.data.Comments}</span></div>
            <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.handleGoBack}>Voltar</Button>
            </ButtonToolbar>
        </div>);
    }
}
