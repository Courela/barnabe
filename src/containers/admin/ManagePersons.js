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
            idCardNr: props.location.search ? queryString.parse(props.location.search).idCardNr : null,
            data: []
        };

        this.fillSearchCriteria = this.fillSearchCriteria.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
        this.handleControlChange = this.handleControlChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.state.idCardNr) {
            this.fetchResults();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.fillSearchCriteria(nextProps);
        }
    }

    fillSearchCriteria(props) {
        const { idCardNr } = queryString.parse(props.location.search);
        if (idCardNr) {
            this.setState({
                idCardNr: idCardNr
            }, () => this.fetchResults());
        }
    }

    fetchResults() {
        const { idCardNr } = this.state;
        searchPersons(idCardNr)
            .then(result => {
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
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmit(evt) {
        const { idCardNr } = this.state;
        if (idCardNr.length > 0) {
            this.props.history.push(this.props.location.pathname + '?idCardNr=' + idCardNr);
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
                name="idCardNr"
                label="Nr Cartão Cidadão"
                placeholder="Nr Cartão Cidadão"
                value={this.state.idCardNr}
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