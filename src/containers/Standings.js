import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class Standings extends Component {
    getData() {
        return [{
            team: 'Aruil',
            won: 1,
            draw: 1,
            lost: 1,
            scored: 5,
            conceded: 5,
            points: 4
        },{
            team: 'Almargem',
            won: 1,
            draw: 1,
            lost: 1,
            scored: 5,
            conceded: 5,
            points: 4
        }];
    }

    render() {
        return (
            <div style={{ display: 'inline' }}>
                <h1>Classificação</h1>
                <div>
                    {standingsTable(this.getData())}
                </div>
            </div>
        );
    }
}

function standingsTable(data) {
    let rows = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        rows.push(
            <tr key={index}>
                <td>{element.team}</td>
                <td>{element.won}</td>
                <td>{element.draw}</td>
                <td>{element.lost}</td>
                <td>{element.scored}</td>
                <td>{element.conceded}</td>
                <td>{element.points}</td>
            </tr>);
    }
    const table = <Table striped bordered condensed hover style={{ width: '70%' }}>
        <tbody>
            <tr>
                <th>Equipa</th>
                <th>Vitórias</th>
                <th>Empates</th>
                <th>Derrotas</th>
                <th>Golos Marcados</th>
                <th>Golos Sofridos</th>
                <th>Pontos</th>
            </tr>
            {rows}
        </tbody>
    </Table>;

    return table;
}