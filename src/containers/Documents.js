import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class Documents extends Component {
    render() {
        const data = [
            { name: 'calendario_escolinhas.jpg', type: 'Calendário Escolinhas', download: 'https://drive.google.com/file/d/1sFkjitbnOgP1iP3oDHgbKZ3akKdbM-SC/view?usp=sharing' },
            { name: 'calendario_escalaoI.jpg', type: 'Calendário Escalão I', download: 'https://drive.google.com/file/d/1UwHqWr3tHM9jr85oCZfVtN3gTFW3R1MM/view?usp=sharing' },
            { name: 'calendario_escalaoII.jpg', type: 'Calendário Escalão II', download: 'https://drive.google.com/file/d/1HtiT8Lh4l1Z66gMqtJnU1Mv_Y0btfzJU/view?usp=sharing' },
            { name: 'calendario_feminino.jpg', type: 'Calendário Feminino', download: 'https://drive.google.com/file/d/1YgOXNWwCZMZDyWcI467Bn-0hwuwlbfXW/view?usp=sharing' },
            { name: 'calendario_escalaoIII.jpg', type: 'Calendário Escalão III', download: 'https://drive.google.com/file/d/13lK-aKX4IednRxPGW-p0TGxOM-lUZd5c/view?usp=sharing' },
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
