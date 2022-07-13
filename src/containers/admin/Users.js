import React, { Component, Fragment } from 'react';
import Table from '../../components/Table';
import errors from '../../components/Errors';
import { getUsers } from '../../utils/communications';

export default class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };

        this.getUsers = this.getUsers.bind(this);
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        getUsers()
            .then(result => {
                if (result.data && result.data.length > 0) {
                    this.setState({ users: result.data });
                }
            })
            .catch(errors.handleError);
    }

    render() {
        return (
            <Fragment>
                <h2>Utilizadores</h2>
                <Table
                    columns={[
                        { Header: 'Nome de Utilizador', id: 'id', accessor: 'Username' },
                        { Header: 'Colectividade', id: 'team', accessor: 'team.ShortDescription' }
                    ]}
                    data={this.state.users}
                    onFetchData={this.getUsers}  />
            </Fragment>);
    }
}
