import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class Documents extends Component {
    render() {
        const data = [
            { name: 'ficha_equipa.pdf', type: 'Ficha Equipa', download: '/doc/ficha_equipa.pdf' },
            { name: 'fotos_equipa.pdf', type: 'Fotos Equipa', download: '/doc/fotos_equipa.pdf' }
        ];

        const rows = data.map((row, idx) => <tr key={idx}>
            <td>{idx}</td>
            <td>{row.name}</td>
            <td>{row.type}</td>
            <td><a href={row.download}>Download</a></td>
        </tr>);

        const table = <Table striped bordered condensed hover style={{ width: '70%'}}>
            <thead>
                <tr>
                    <th>#</th>
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
                <input type="file" />
            </div>
        );
    }
}
