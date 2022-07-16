import React from 'react';
import { Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap';
import Table from '../components/Table';
import { dateFormat } from '../utils/formats';
import { isResident, isValidPlayer } from '../utils/validations';

export default function PlayersTable(props) {
    const statusIcon = (player) => {
        const tooltip = <Tooltip id="tooltip">Dados em falta!</Tooltip>;

        const isValid = isValidPlayer(player);
        if (isValid) {
            return <Glyphicon glyph="ok-sign" style={{ color: 'green' }}/>
        }
        else {
            return (
                <OverlayTrigger placement="left" overlay={tooltip}>
                    <Glyphicon glyph="remove-sign" style={{ color: 'red' }} />
                </OverlayTrigger>);
        }
    };

    let columns = [
        { Header: "Nome", id: 'id', accessor: "person.name", Cell: (row) => props.linkToPlayer(row.original) },
        { Header: "Data Nascimento", id: "birthdate", accessor: "person.birthdate", Cell: (row) => dateFormat(row.original.person.birthdate) },
        { Header: "Cartão Cidadão", id: "idCardNr", accessor: "person.id_card_number" },
        { Header: "Estrangeiro", id: "foreign", Cell: (row) => isResident(row.original) }
    ];

    if (props.isSeasonActive) {
        columns.splice(0, 0, { Header: "", id: 'icon', accessor: "Id", width: 25, Cell: (row) => statusIcon(row.original) });
        columns.push({ Header: "", id: "actions", accessor: 'id', Cell: (row) => props.playerActions(row.original) });
    }

    return (<div>
        <Table
            columns={columns}
            data={props.players}
        />
    </div>);
}
