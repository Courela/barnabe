import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class Documents extends Component {
    render() {
        const data = [
            { name: 'Ficha_Inscricao_Jogador.pdf', type: 'Ficha Individual de Jogador', download: 'https://drive.google.com/file/d/1WgNrlMmyZnD_-TAFRH40G1TZCiKr7bYj/view?usp=sharing' },
            { name: 'Regulamento_Desportivo_2022.pdf', type: 'Regulamento Desportivo 2022', download: 'https://drive.google.com/file/d/1Uj-wNu0Gv4q9FGyd8EEhgQ2N6VpBUYC4/view?usp=sharing' },
            { name: 'Regulamento_Organizacao.pdf', type: 'Regulamento da Organização', download: 'https://drive.google.com/open?id=0B6mGDIzH6fPwOEdwTnREMmVFbUttSjlvdlNDamNVOWUzSHBR' }
            // { name: 'MapaPavilhao.pdf', type: 'Mapa de ocupação de pavilhão', download: 'https://drive.google.com/file/d/1giu3mqrjgrED9WaaKovQcVmxVrpjq9Kx/view?usp=sharing' }
        ];

        const rows = data.map((row, idx) => <tr key={idx}>
            <td>{row.name}</td>
            <td>{row.type}</td>
            <td><a href={row.download} target="_blank" rel="noopener noreferrer">Download</a></td>
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
