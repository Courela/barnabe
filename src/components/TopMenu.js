import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from 'axios';
import settings from '../settings';

export default class TopMenu extends Component {
    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(event) {
        if (this.props.userHasAuthenticated) {
            sessionStorage.clear();
            this.props.userHasAuthenticated(false, null, null);
            axios.post(settings.API_URL + '/api/logout');
        }
    }

    handleSelect(eventKey) {
        //event.preventDefault();
        //alert(`selected ${eventKey}`);
    }

    render() {
        const authenticatedOptions = 
            <Fragment>
                <NavItem disabled>User: {this.props.username}</NavItem>
                <NavItem onClick={this.handleLogout}>Logout</NavItem>
            </Fragment>;
        const anonymousOptions =
            <Fragment>
                <LinkContainer to="/torneio">
                    <NavItem>Torneio</NavItem>
                </LinkContainer>
                <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                </LinkContainer>
            </Fragment>;

        const menuOptions =
            <Nav pullRight>
                {this.props.isAuthenticated
                    ? authenticatedOptions
                    : anonymousOptions
                }
            </Nav>;
            
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
                            <NavDropdown eventKey={3} title="Edição" id="basic-nav-dropdown">
                                <LinkContainer to="/season/2018">
                                    <MenuItem>2018</MenuItem>
                                </LinkContainer>
                                <MenuItem divider />
                                <LinkContainer to="/season/2017">
                                    <MenuItem>2017</MenuItem>
                                </LinkContainer>
                            </NavDropdown>
                        </Nav>
                        {menuOptions}
                    </Navbar.Collapse>
                </Navbar>
            </div>);
    }
}