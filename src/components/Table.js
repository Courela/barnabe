import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { clientSettings } from '../clientSettings';
import localization from '../localization';

export default function Table(props) {
    return (<ReactTable
        columns={props.columns}
        data={props.data ?? []}
        minRows="0"
        defaultPageSize={clientSettings.DEFAULT_TABLE_PAGE_SIZE}
        className="-striped"
        previousText={localization.BTN_001}
        nextText={localization.BTN_002}
        loadingText={localization.LBL_001}
        noDataText={localization.LBL_002}
        pageText={localization.LBL_003}
        ofText={localization.LBL_004}
        rowsText={localization.LBL_005}
        />);
}

