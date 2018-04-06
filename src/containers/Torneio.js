import React, { Component } from 'react';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import 'react-table/react-table.css'

export default class Torneio extends Component {
    constructor(props) {
        super(props);

        this.state = { data: [] };
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.setState({ data: this.getData() });
    }

    getData() {
        return [
            { id: 1, name: 'Teste 1', birthdate: new Date(2000, 1, 1).toString() },
            { id: 2, name: 'Teste 2', birthdate: new Date(2000, 1, 2).toString() },
            { id: 3, name: 'Teste 3', birthdate: new Date(2000, 1, 1).toString() },
            { id: 4, name: 'Teste 4', birthdate: new Date(2000, 1, 2).toString() },
            { id: 5, name: 'Teste 5', birthdate: new Date(2000, 1, 1).toString() },
            { id: 6, name: 'Teste 6', birthdate: new Date(2000, 1, 2).toString() }
        ];
    }

    render() {
        return (
            <div>
                <div>Torneio</div>
                <ReactTable 
                    columns={[
                        { Header: "Nome", id: 'id', Cell: row => <Link to={'/player/' + row.value}>{row.original.name}</Link> },
                        { Header: "Data Nascimento", accessor: "birthdate" },
                        { Header: "", accessor: 'id', Cell: o => <Link to={'/player/' + o.value + '?edit'}>Editar</Link> }
                    ]}
                    data={this.state.data}
                    minRows={Math.max(Math.min(this.state.data.length, 5), 1)}
                    onFetchData={this.getData} 
                    defaultPageSize={5}
                    className="-striped"/>
            </div>
        );
    }
}