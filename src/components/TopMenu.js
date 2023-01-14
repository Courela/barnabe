import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { getSeasons, getTeam, logout } from '../utils/communications';
import SeasonDropDown from '../components/SeasonDropDown';

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
    }

    componentDidUpdate() {
        if(!this.state.teamName && this.props.teamId) {
            getTeam(this.props.teamId)
                .then(team => {
                    if (team) {
                        this.setState({ teamName: team.name });
                    }
                })
        }
        if(this.state.teamName && !this.props.teamId) {
            this.setState({ teamName: null });
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
                { this.state.teamName ? <NavItem disabled>Equipa: {this.state.teamName}</NavItem> : '' }
                <NavItem disabled>Utilizador: {this.props.username}</NavItem>
                <LinkContainer to="/account">
                    <NavItem>Conta</NavItem>
                </LinkContainer>
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
                {this.props.isAuthenticated ? 
                    <SeasonDropDown 
                        onSeasonChange={this.props.onSeasonChange} 
                        seasons={this.state.seasons} /> : 
                    <Fragment>
                        <LinkContainer to="/documents">
                            <NavItem>Documentos</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/matches">
                            <NavItem>Jogos</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/standings">
                            <NavItem>Classificação</NavItem>
                        </LinkContainer>
                    </Fragment>
                }
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
