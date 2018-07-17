import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import checkboxHOC from "react-table/lib/hoc/selectTable";
import {
    FormGroup, FormControl, ControlLabel, HelpBlock,
    Button, Panel, Image, Checkbox
} from 'react-bootstrap';
import axios from 'axios';
import settings from '../settings';
import errors from '../components/Errors';

const CheckboxTable = checkboxHOC(ReactTable);

export default class ImportPlayers extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            season: props.match.params.year,
            teamId: props.teamId,
            stepId: props.match.params.stepId,
            players: [{ Id: 1, Name: 'Test', Birthdate: '1900-01-01', IdCardNr: '123456798' }],
            selection: [],
            selectAll: false
        };

        this.getPlayers = this.getPlayers.bind(this);
        this.toggleSelection = this.toggleSelection.bind(this);
    }

    getPlayers() {
        if (this.state.players.length === 0) {
            const { season, teamId, stepId } = this.state;
            axios.get(settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players')
                .then(result => {
                    //console.log(result);
                    if (result.data && result.data.length > 0) {
                        this.setState({ players: result.data });
                    }
                })
                .catch(errors.handleError);
        }
        if (!this.state.stepName) {
            axios.get(settings.API_URL + '/api/steps/' + this.state.stepId)
                .then(result => {
                    //console.log(result);
                    if (result.data) {
                        this.setState({ stepName: result.data.Description });
                    }
                })
                .catch(errors.handleError);
        }
    }

    toggleSelection(key, shift, row) {
        /*
          Implementation of how to manage the selection state is up to the developer.
          This implementation uses an array stored in the component state.
          Other implementations could use object keys, a Javascript Set, or Redux... etc.
        */
        // start off with the existing state
        let selection = [...this.state.selection];
        const keyIndex = selection.indexOf(key);
        // check to see if the key exists
        if (keyIndex >= 0) {
            // it does exist so we will remove it using destructing
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
        } else {
            // it does not exist so add it
            selection.push(key);
        }
        // update the state
        this.setState({ selection });
    }

    toggleAll = () => {
        /*
          'toggleAll' is a tricky concept with any filterable table
          do you just select ALL the records that are in your data?
          OR
          do you only select ALL the records that are in the current filtered data?
          
          The latter makes more sense because 'selection' is a visual thing for the user.
          This is especially true if you are going to implement a set of external functions
          that act on the selected information (you would not want to DELETE the wrong thing!).
          
          So, to that end, access to the internals of ReactTable are required to get what is
          currently visible in the table (either on the current page or any other page).
          
          The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
          ReactTable and then get the internal state and the 'sortedData'. 
          That can then be iterrated to get all the currently visible records and set
          the selection state.
        */
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {
            // we need to get at the internals of ReactTable
            const wrappedInstance = this.checkboxTable.getWrappedInstance();
            // the 'sortedData' property contains the currently accessible records based on the filter and sort
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            // we just push all the IDs onto the selection array
            currentRecords.forEach(item => {
                selection.push(item._original._id);
            });
        }
        this.setState({ selectAll, selection });
    };

    isSelected = key => {
        /*
          Instead of passing our external selection state we provide an 'isSelected'
          callback and detect the selection state ourselves. This allows any implementation
          for selection (either an array, object keys, or even a Javascript Set object).
        */
        return this.state.selection.includes(key);
    };

    logSelection = () => {
        console.log("selection:", this.state.selection);
    };

    render() {
        const { toggleSelection, toggleAll, isSelected, logSelection } = this;
        const { players, selectAll } = this.state;
        const columns = [
            { Header: "Nome", accessor: "Name" },
            { Header: "Data Nascimento", accessor: "Birthdate" },
            { Header: "Cartão Cidadão", accessor: "IdCardNr" }
        ];

        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: "checkbox"
            // getTrProps: (s, r) => {
            //     // someone asked for an example of a background color change
            //     // here it is...
            //     const selected = this.isSelected(r.original.Id);
            //     return {
            //         style: {
            //             backgroundColor: selected ? "lightgreen" : "inherit"
            //             // color: selected ? 'white' : 'inherit',
            //         }
            //     };
            // }
        };

        return (
            <div>
                <button onClick={logSelection}>Log Selection</button>
                <CheckboxTable
                    ref={r => (this.checkboxTable = r)}
                    data={players}
                    columns={columns}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    {...checkboxProps} />
            </div>);
        // return (<PlayersTable players={this.state.players} getPlayers={this.getPlayers} />)
    }
}

function PlayersTable(props) {
    return (<div>
        <ReactTable
            columns={[
                { Header: "", accessor: 'Id', Cell: (row) => <Checkbox /> },
                { Header: "Nome", accessor: "Name" },
                { Header: "Data Nascimento", accessor: "Birthdate" },
                { Header: "Cartão Cidadão", accessor: "IdCardNr" }
            ]}
            data={props.players}
            minRows={Math.max(Math.min(props.players.length, 5), 1)}
            onFetchData={props.getPlayers}
            defaultPageSize={5}
            className="-striped" />
    </div>);
}
