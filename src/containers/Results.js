import React, { Component } from 'react';
//import Breadcrumb from 'react-bootstrap';
import { Table } from 'react-bootstrap';

export default class Results extends Component {
    getData() {
        return [{
            team1: 'Aruil',
            score1: 0,
            team2: 'Almargem',
            score2: 0
        },{
            team1: 'Almargem',
            score1: 1,
            team2: 'Aruil',
            score2: 1
        }];
    }

    render() {
        return (
            <div>
                <h1>Resultados</h1>
                <div>
                    {resultsTable(this.getData())}
                </div>
            </div>
        );
    }
}

function resultsTable(data) {
    let rows = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        rows.push(
            <tr key={index}>
                <td>{element.team1}</td>
                <td>{element.score1}</td>
                <td>{element.score2}</td>
                <td>{element.team2}</td>
            </tr>);
    }
    const table = <Table striped bordered condensed hover style={{ width: '70%' }}>
        <tbody>
            {rows}
        </tbody>
    </Table>;

    return table;
}