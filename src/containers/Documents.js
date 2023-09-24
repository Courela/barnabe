import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { getDocuments } from '../utils/communications';

export default class Documents extends Component {
    constructor(props){
        super(props);

        this.state = {
            documents: []
        };
    }

    async componentDidMount() {
        const data = await getDocuments();
        this.setState({ documents: data });
    }

    render() {
        const rows = this.state.documents.map((row, idx) => <tr key={idx}>
            <td>{row.name}</td>
            <td>{row.type}</td>
            <td><a href={row.link} target="_blank" rel="noopener noreferrer">Download</a></td>
        </tr>);

        const table = <Table striped bordered condensed hover style={{ width: '70%'}}>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Download</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>;

        return (
            <div>
                <h2>Documentos</h2>
                {table}
            </div>
        );
    }
}
