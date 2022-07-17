import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { getSeasons, getTeam, logout } from '../utils/communications';

export default class TopMenu extends Component {
    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.state = {
            seasons: [],
            teamName: null
        }
    }

    componentDidMount() {
        if (this.state.seasons.length === 0) {
            getSeasons()
                .then(seasons => {
                    this.setState({ seasons: seasons });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        if(!this.state.teamName && this.props.teamId) {
            getTeam(this.props.teamId)
                .then(team => {
                    if (team) {
                        this.setState({ teamName: team.name });
                    }
                })
        }
    }

    async handleLogout(event) {
        event.preventDefault();
        if (this.props.userHasAuthenticated) {
            await logout(this.props.username);
            sessionStorage.clear();
            this.props.userHasAuthenticated(false, null, null);
        }
    }

    handleSelect(eventKey) {
        //eventKey.preventDefault();
        //alert(`selected ${eventKey}`);
    }

    render() {
        const authenticatedOptions =
            <Fragment>
                <NavItem disabled>Utilizador: {this.props.username}</NavItem>
                { this.state.teamName ? <NavItem disabled>Equipa: {this.state.teamName}</NavItem> : '' }
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
                {this.props.isAuthenticated ? <SeasonDropDown seasons={this.state.seasons} /> : 
                <LinkContainer to="/documents">
                    <NavItem>Documentos</NavItem>
                </LinkContainer> }
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

function SeasonDropDown(props) {
    let seasons = [];
    if (props.seasons.length > 0) {
        const activeSeason = props.seasons.find(s => s.is_active);
        const indexActive = props.seasons.indexOf(activeSeason);

        seasons = props.seasons.map(s => s.year);
        seasons.splice(indexActive, 1);
        seasons.splice(0, 0, activeSeason.year, 0);
    }

    return (
        <NavDropdown title="Edição" id="season-nav-dropdown">
            {seasons.map((s, idx) => {
                return (s > 0 ? 
                    <LinkContainer key={idx} to={'/seasons/' + s}><MenuItem>{s}</MenuItem></LinkContainer> : 
                    <MenuItem key={idx} divider />
                );
            })}
        </NavDropdown>);
}