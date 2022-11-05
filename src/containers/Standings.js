import React, { Component } from 'react';

export default class Standings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <TableStandings year={this.props.year}/>;
    }
}

function TableStandings(props) {
    return (
        <table>
            <thead>
                <th>Pos.</th>
                <th>Equipa</th>
                <th>Pontos</th>
                <th>GM</th>
                <th>GS</th>
                <th>Dif</th>
            </thead>
            <tbody>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tbody>
        </table>
    );
}