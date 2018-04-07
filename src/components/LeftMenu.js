import React, { Component } from 'react';
import { Nav, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default class LeftMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            season: this.props.match.params.year
        };

        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(selectedKey) {
        //console.log(`LeftMenu selected ${selectedKey}`);
        this.props.history.push(selectedKey);
    }

    render() {
        return (
            <div style={{float: 'left' }}>
                <Nav stacked onSelect={this.handleSelect}>
                    <LinkContainer to={"/season/" + this.state.season + "/results"}>
                        <NavItem>Resultados</NavItem>
                    </LinkContainer>
                    <LinkContainer to={"/season/" + this.state.season + "/standings"}>
                        <NavItem>Classificação</NavItem>
                    </LinkContainer>
                    <LinkContainer to={"/season/" + this.state.season + "/team"}>
                        <NavItem>Equipas</NavItem>
                    </LinkContainer>
                    <NavItem eventKey={"/season/" + this.state.season + "/team/1"}>Teste</NavItem>
                </Nav>
            </div>);
    }
}
