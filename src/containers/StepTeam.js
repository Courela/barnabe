import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Button } from 'react-bootstrap';
import axios from 'axios';
import settings from '../settings';
import errors from '../components/Errors';

export default class StepTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            season: props.match.params.year,
            teamId: props.teamId,
            stepId: props.match.params.stepId,
            stepName: null,
            data: [],
            staff: []
        };

        this.getData = this.getData.bind(this);
        this.getStaff = this.getStaff.bind(this);
        this.linkToPlayer = this.linkToPlayer.bind(this);
        this.removePlayer = this.removePlayer.bind(this);
        this.handleNewPlayer = this.handleNewPlayer.bind(this);
        this.handleNewStaff = this.handleNewStaff.bind(this);
    }

    componentDidMount() {
        this.getData();
        this.getStaff();
    }

    componentWillReceiveProps(newProps) {
        //console.log('New step: ', newProps.match.params.stepId);
        this.setState({ stepId: newProps.match.params.stepId, stepName: null, data: [], staff: [] }, () => {
            this.getData();
            this.getStaff();
        });
    }

    getData() {
        if (this.state.data.length === 0) {
            const { season, teamId, stepId } = this.state;
            axios.get(settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players')
                .then(result => {
                    //console.log(result);
                    if (result.data && result.data.length > 0) {
                        this.setState({ data: result.data });
                    }
                })
                .catch(errors.handleError);
        }
        if (!this.state.stepName) {
            axios.get(settings.API_URL + '/api/steps/' + this.state.stepId)
                .then(result => {
                    //console.log(result);
                    if (result.data) {
                        this.setState({ stepName: result.data.Description });
                    }
                })
                .catch(errors.handleError);
        }
    }

    getStaff() {
        if (this.state.data.length === 0) {
            const { season, teamId, stepId } = this.state;
            axios.get(settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/staff')
                .then(result => {
                    //console.log(result);
                    if (result.data && result.data.length > 0) {
                        this.setState({ staff: result.data });
                    }
                })
                .catch(errors.handleError);
        }
    }

    linkToPlayer(row, edit) {
        const { season, stepId } = this.state;
        const queryString = edit ? '?edit' : '';
        const text = edit ? "Editar" : row.original.Name;
        return (<Link to={'/seasons/' + season + '/steps/' + stepId + '/players/' + row.original.Id + queryString}>{text}</Link>);
    }

    removePlayerLink(row) {
        return (
            <Fragment>
                <a onClick={() => this.removePlayer(row.original.Id, row.original.Name)} href="#">Remover</a>
            </Fragment>
        );
    }

    async removePlayer(id, name) {
        const { season, teamId, stepId } = this.state;
        if (window.confirm('Tem a certeza que quer remover o jogador ' + name + '?')) {
            await axios.delete(settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + id);
            this.setState({ data: [], staff: [] }, () => { 
                this.getData(); 
                this.getStaff(); 
            });
        }
    }

    handleNewPlayer() {
        const { season, stepId } = this.state;
        this.props.history.push('/seasons/' + season + '/steps/' + stepId + '/player');
    };

    handleNewStaff() {
        const { season, stepId } = this.state;
        this.props.history.push('/seasons/' + season + '/steps/' + stepId + '/staff');
    };

    render() {
        return (
            <Fragment>
                <h2>{this.state.stepName}</h2>
                <div style={{ float: 'right' }}>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={this.handleNewPlayer}>Adicionar Jogador</Button>
                    </ButtonToolbar>
                </div>
                <div>
                    <h3>Jogadores</h3>
                    <div>
                        <ReactTable
                            columns={[
                                { Header: "Nome", id: 'Id', Cell: (row) => this.linkToPlayer(row, false) },
                                { Header: "Data Nascimento", accessor: "Birthdate" },
                                { Header: "Cartão Cidadão", accessor: "IdCardNr" },
                                { Header: "", accessor: 'Id', Cell: (row) => this.linkToPlayer(row, true) },
                                { Header: "", accessor: 'Id', Cell: (row) => this.removePlayerLink(row) }
                            ]}
                            data={this.state.data}
                            minRows={Math.max(Math.min(this.state.data.length, 5), 1)}
                            onFetchData={this.getData}
                            defaultPageSize={5}
                            className="-striped" />
                    </div>
                </div>
                <div style={{ marginTop: '30px', clear: 'right' }}>
                    <div style={{ float: 'right' }}>
                        <ButtonToolbar>
                            <Button bsStyle="primary" onClick={this.handleNewStaff}>Adicionar Elemento</Button>
                        </ButtonToolbar>
                    </div>
                    <h3>Equipa Técnica</h3>
                    <div>
                        <ReactTable
                            columns={[
                                { Header: "Nome", id: 'Id', Cell: (row) => this.linkToPlayer(row, false) },
                                { Header: "Data Nascimento", accessor: "Birthdate" },
                                { Header: "Cartão Cidadão", accessor: "IdCardNr" },
                                { Header: "", accessor: 'Id', Cell: (row) => this.linkToPlayer(row, true) },
                                { Header: "", accessor: 'Id', Cell: (row) => this.removePlayerLink(row) }
                            ]}
                            data={this.state.staff}
                            minRows={Math.max(Math.min(this.state.staff.length, 5), 1)}
                            onFetchData={this.getStaff}
                            defaultPageSize={5}
                            className="-striped" />
                    </div>
                </div>
            </Fragment>);
    }
}