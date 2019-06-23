import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import queryString from 'query-string';
import errors from '../../components/Errors';
import { FieldGroup } from '../../utils/controls';
import { searchPersons } from '../../utils/communications';

export default class ManagePersons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            docId: props.location.search ? queryString.parse(props.location.search).docId : null,
            data: []
        };

        this.fillSearchCriteria = this.fillSearchCriteria.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
        this.handleControlChange = this.handleControlChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.state.docId) {
            this.fetchResults();
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('Next: ', nextProps);
        console.log('Actual: ', this.props);
        if (nextProps.location.search !== this.props.location.search) {
            this.fillSearchCriteria(nextProps);
        }
    }

    fillSearchCriteria(props) {
        const { docId } = queryString.parse(props.location.search);
        if (docId) {
            //console.log('Set state: ', season, teamId, stepId);
            this.setState({
                docId: docId
            }, () => this.fetchResults());
        }
    }

    fetchResults() {
        const { docId } = this.state;
        searchPersons(docId)
            .then(result => {
                //console.log(result);
                if (result.data) {
                    this.setState({ data: result.data });
                }
                else {
                    this.setState({ data: [] });
                }
            })
            .catch(errors.handleError);
    }

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        //console.log(fieldName, fieldVal);
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmit(evt) {
        const { docId } = this.state;
        if (docId.length > 0) {
            this.props.history.push(this.props.location.pathname + '?docId=' + docId);
        }
        else {
            alert('Preencha todos os critérios de pesquisa.');
        }
        
        if(evt) { evt.preventDefault(); }
    }

    render() {
        return (<div>
            <div>
            <FieldGroup
                id="formIdCard"
                type="text"
                name="docId"
                label="Nr Cartão Cidadão"
                placeholder="Nr Cartão Cidadão"
                value={this.state.docId}
                onChange={this.handleControlChange}
                maxLength="30"
            />
            <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Pesquisar</Button>
            </div>
            <div style={{whiteSpace: 'pre'}}>
                {JSON.stringify(this.state.data, undefined, 2)}
            </div>
        </div>);
    }
}