import React from 'react';
import ReactTable from 'react-table';
import settings from '../settings';

export default function Table(props) {
    return (<ReactTable
        columns={props.columns}
        data={props.data}
        minRows="0"
        onFetchData={props.onFetchData}
        defaultPageSize={settings.DEFAULT_TABLE_PAGE_SIZE}
        className="-striped"
        previousText='Anterior'
        nextText= 'Próxima'
        loadingText= 'Carregando...'
        noDataText= 'Sem dados'
        pageText= 'Página'
        ofText= 'de'
        rowsText= 'linhas'
        />);
}

