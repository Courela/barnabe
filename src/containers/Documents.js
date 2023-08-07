import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class Documents extends Component {
    render() {
        const data = [
            { name: 'Ficha_Inscricao_Jogador.pdf', type: 'Ficha Individual de Jogador', download: 'https://drive.google.com/file/d/1ZiSONsY8Zr2o5wIQuSLbcplovY6DAH-Q/view?usp=sharing' },
            { name: 'Regulamento_desportivo_2023.pdf', type: 'Regulamento Desportivo 2023', download: 'https://drive.google.com/file/d/11Shg03w-2W7DxK663heO7nryndqr6Jy6/view?usp=sharing' },
            { name: 'Regulamento_Organizacao.pdf', type: 'Regulamento da Organização', download: 'https://drive.google.com/file/d/0B6mGDIzH6fPwOEdwTnREMmVFbUttSjlvdlNDamNVOWUzSHBR/view?usp=sharing&resourcekey=0-D_JJwmynKutiIrKPQieC6A' }
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
