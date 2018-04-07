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

    componentDidMount() {
        //this.setState({ season: this.props.match.params.year });
    }

    handleSelect(selectedKey) {
        console.log(`LeftMenu selected ${selectedKey}`);
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
                </Nav>
            </div>);
    }
}
