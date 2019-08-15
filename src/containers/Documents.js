import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class Documents extends Component {
    render() {
        const data = [
            { name: 'Ficha_Inscricao_Jogador.pdf', type: 'Ficha Individual de Jogador', download: 'https://drive.google.com/open?id=1B-eFuHdWttK77IaNaYiKUW9Wk8Nb-a_f' },
            { name: 'Regulamento_Desportivo_2019.pdf', type: 'Regulamento Desportivo 2019', download: 'https://drive.google.com/file/d/1GpnPTyuPhzyLk6DuPl2u8o4VGFNiFM9d/view?usp=sharing' },
            { name: 'Regulamento_Organizacao.pdf', type: 'Regulamento da Organização', download: 'https://drive.google.com/open?id=0B6mGDIzH6fPwOEdwTnREMmVFbUttSjlvdlNDamNVOWUzSHBR' },
            { name: 'MapaPavilhao.pdf', type: 'Mapa de ocupação de pavilhão', download: 'https://drive.google.com/file/d/1giu3mqrjgrED9WaaKovQcVmxVrpjq9Kx/view?usp=sharing' }
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
