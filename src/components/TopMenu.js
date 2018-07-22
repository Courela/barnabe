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

        this.state = {
            seasons: []
        }
    }

    componentDidMount() {
        if (this.state.seasons.length === 0) {
            axios.get(settings.API_URL + '/api/seasons')
                .then((result) => {
                    if (result.data && result.data.length > 0) {
                        this.setState({ seasons: result.data });
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }

    handleLogout(event) {
        event.preventDefault();
        if (this.props.userHasAuthenticated) {
            axios.post(settings.API_URL + '/api/logout');
            sessionStorage.clear();
            this.props.userHasAuthenticated(false, null, null);
        }
    }

    handleSelect(eventKey) {
        //event.preventDefault();
        //alert(`selected ${eventKey}`);
    }

    render() {
        const seasons = this.state.seasons.map(s => 
            <Fragment key={s.Year}>
                <LinkContainer to={'/seasons/' + s.Year}>
                    <MenuItem>{s.Year}</MenuItem>
                </LinkContainer>
                {s.IsActive ? <MenuItem divider /> : '' }
            </Fragment>
        );

        const authenticatedOptions = 
            <Fragment>
                <NavItem disabled>Utilizador: {this.props.username}</NavItem>
                <NavItem onClick={this.handleLogout}>Sair</NavItem>
            </Fragment>;
        const anonymousOptions =
            <Fragment>
                <LinkContainer to="/login">
                    <NavItem>Entrar</NavItem>
                </LinkContainer>
            </Fragment>;

        const menuOptions =
            <Nav pullRight>
                {this.props.isAuthenticated
                    ? authenticatedOptions
                    : anonymousOptions
                }
            </Nav>;

        const leftSideOptions = 
            <Fragment>
                <NavDropdown eventKey={3} title="Edição" id="basic-nav-dropdown">
                    {seasons}
                </NavDropdown>
                <LinkContainer to="/documents">
                    <NavItem>Documentos</NavItem>
                </LinkContainer>
            </Fragment>;
            
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
                            {leftSideOptions}
                        </Nav>
                        {menuOptions}
                    </Navbar.Collapse>
                </Navbar>
            </div>);
    }
}