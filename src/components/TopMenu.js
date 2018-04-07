import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default class TopMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false
        };

        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        console.log('State: ' + this.state.isAuthenticated + ' | Props: ' + this.props.isAuthenticated);
        this.setState({ isAuthenticated: this.props.isAuthenticated });
    }

    handleLogout = event => {
        this.props.userHasAuthenticated(false);
    }

    handleSelect(eventKey) {
        //event.preventDefault();
        //alert(`selected ${eventKey}`);
    }

    render() {
        return (
            <div>
                <Navbar fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">Taça Barnabé</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav onSelect={this.handleSelect}>
                            <NavDropdown eventKey={3} title="Época" id="basic-nav-dropdown">
                                <LinkContainer to="/season/2018">
                                    <MenuItem>2018</MenuItem>
                                </LinkContainer>
                                <MenuItem divider />
                                <LinkContainer to="/season/2017">
                                    <MenuItem>2017</MenuItem>
                                </LinkContainer>
                            </NavDropdown>
                        </Nav>
                        <Nav pullRight>
                            <LinkContainer to="/about">
                                <NavItem>Sobre</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/torneio">
                                <NavItem>Torneio</NavItem>
                            </LinkContainer>
                            {this.state.isAuthenticated
                                ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                                : <Fragment>
                                    <LinkContainer to="/login">
                                        <NavItem>Login</NavItem>
                                    </LinkContainer>
                                </Fragment>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>);
    }
}