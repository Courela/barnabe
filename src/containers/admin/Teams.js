import React, { Component, Fragment } from 'react';
import Table from '../../components/Table';
import errors from '../../components/Errors';
import { getTeams } from '../../utils/communications';

export default class Teams extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: []
        };

        this.getTeams = this.getTeams.bind(this);
    }

    componentDidMount() {
        this.getTeams();
    }

    getTeams() {
        getTeams()
            .then(teams => {
                this.setState({ teams: teams });
            })
            .catch(errors.handleError);
    }

    render() {
        return (
            <Fragment>
                <h2>Colectividades</h2>
                <Table
                    columns={[
                        { Header: '', id: 'id', width: 50, Cell: (val) => val && val.index >= 0 ? val.index + 1 : null },
                        { Header: 'Colectividade', id: 'name', accessor: 'name' },
                        { Header: 'Abreviatura', id: 'shortDescription', accessor: 'short_description' }
                    ]}
                    data={this.state.teams}
                    onFetchData={this.getTeams}  />
            </Fragment>);
    }
}
