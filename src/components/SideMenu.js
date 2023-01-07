/* eslint no-console:0 */

import React, { Component } from 'react';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu/lib';
import 'rc-menu/assets/index.css';
import animate from 'css-animation/lib';
import errors from './Errors';
import { getTeams, getTeamSteps } from '../utils/communications';

export default class SideMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            season: props.season,
            teams: [],
            steps: [],
            isSeasonActive: props.isSeasonActive
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.getTeams = this.getTeams.bind(this);
        this.getTeamSteps = this.getTeamSteps.bind(this);
        this.teamsMenu = this.teamsMenu.bind(this);
        this.stepsMenu = this.stepsMenu.bind(this);
        this.buildTeamsMenuItems = this.buildTeamsMenuItems.bind(this);
    }

    componentDidMount() {
        if (this.props.teamId && parseInt(this.props.teamId, 10) > 0) {
            if (this.props.isAuthenticated) {
                this.getTeamSteps();
            } else {
                this.getTeams();
            }
        } else {
            this.getTeams();
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.match.params.year) {
           return { season: props.match.params.year };
        }
        return null;
    }

    // UNSAFE_componentWillReceiveProps(newProps) {
    //     if (newProps.match.params.year) {
    //         this.setState({ season: newProps.match.params.year });
    //     }
    // }

    getTeams() {
        if (this.state.season > 0) {
            getTeams(this.state.season)
                .then(teams => this.setState({ teams: teams }))
                .catch(errors.handleError);
        }
    }

    handleSelect(info) {
        if (info.key) {
            this.props.history.push(info.key);
        }
    }

    onOpenChange(value) {
    }

    teamsMenu() {
        if (this.state.teams.length > 0) {
            return (
                <SubMenu title={<span>Equipas</span>} key="1">
                    {this.buildTeamsMenuItems()}
                </SubMenu>);
        }
        else {
            return (
                <SubMenu title={<span>Equipas</span>} key="1" disabled>
                    {this.buildTeamsMenuItems()}
                </SubMenu>);
        }
    }

    buildTeamsMenuItems() {
        let menuItems = [];
        this.state.teams.forEach(el => {
            menuItems.push(<MenuItem key={"/seasons/" + this.state.season + "/teams/" + el.id}>{el.short_description}</MenuItem>);
        });
        return menuItems;
    }

    getTeamSteps() {
        getTeamSteps(this.state.season, this.props.teamId)
            .then(steps => this.setState({ steps: steps }))
            .catch(errors.handleError);
    }

    stepsMenu() {
        let menuItems = [];
        this.state.steps.forEach(el => {
            menuItems.push(<MenuItem key={"/seasons/" + this.state.season + "/steps/" + el.id}>{el.description}</MenuItem>);
        });

        if (menuItems.length > 0) {
            return (<SubMenu title={<span>Escalões</span>} key="1">
                {menuItems}
            </SubMenu>);
        }
        else return "";
    }

    render() {
        const anonymousMenu = (
            <AnonymousMenu handleSelect={this.handleSelect} onOpenChange={this.onOpenChange} 
                teamsMenu={this.teamsMenu} season={this.state.season} />
            );

        const authenticatedMenu = (
            <AuthenticatedMenu handleSelect={this.handleSelect} onOpenChange={this.onOpenChange} 
                stepsMenu={this.stepsMenu} season={this.state.season} isSeasonActive={this.state.isSeasonActive}/> 
            );

        const menu = this.props.isAuthenticated ?
            (this.props.teamId > 0 ? authenticatedMenu : <AdminMenu handleSelect={this.handleSelect} />) :
            anonymousMenu;

        return (
            <div style={{ width: 150 }}>
                {menu}
            </div>);
    }
}

function AnonymousMenu(props) {
    return (
        <Menu onSelect={props.handleSelect} onOpenChange={props.onOpenChange} mode="inline" openAnimation={animation}>
            {props.teamsMenu()}
        </Menu>);
}
function AuthenticatedMenu(props) {
    const stepOptions = [
        // <MenuItem key={"/seasons/" + props.season + "/add-step"}>Inscrever escalão</MenuItem>,
        // <MenuItem key={"/seasons/" + props.season + "/remove-step"}>Remover escalão</MenuItem>
    ];
    return (
        <Menu onSelect={props.handleSelect} onOpenChange={props.onOpenChange} mode="inline" openAnimation={animation}>
            {props.isSeasonActive ?
                stepOptions
                : ''}
            {props.stepsMenu()}
            <MenuItem key={"/seasons/" + props.season + "/documents"}>Documentos</MenuItem>
        </Menu>);
}

function AdminMenu(props) {
    return (
        <Menu onSelect={props.handleSelect} onOpenChange={props.onOpenChange} mode="inline" openAnimation={animation}>
            {/* <MenuItem key={"/admin/drive"}>Google Drive</MenuItem> */}
            <MenuItem key={"/admin"}>Estatísticas</MenuItem>
            <MenuItem key={"/admin/db"}>Base de Dados</MenuItem>
            <SubMenu title="Utilizadores">
                <MenuItem key={"/admin/users/add"}>Criar</MenuItem>
                <MenuItem key={"/admin/users"}>Listar</MenuItem>
            </SubMenu>
            <SubMenu title="Colectividades">
                <MenuItem key={"/admin/teams/add"}>Criar</MenuItem>
                <MenuItem key={"/admin/teams"}>Listar</MenuItem>
            </SubMenu>
            <SubMenu title="Jogadores">
                <MenuItem key={"/admin/players/add"}>Inscrever</MenuItem>
                <MenuItem key={"/admin/players/search"}>Procurar</MenuItem>
            </SubMenu>
            <MenuItem key={"/admin/seasons"}>Épocas</MenuItem>
            <MenuItem key={"/admin/manage-steps"}>Gerir escalões</MenuItem>
            <MenuItem key={"/admin/listing"}>Listar</MenuItem>
            <SubMenu title="Fichas de Jogo">
                <MenuItem key={"/admin/templates/match-sheet"}>Jogo</MenuItem>
                <MenuItem key={"/admin/templates/team-sheet"}>Equipa</MenuItem>
            </SubMenu>
            <SubMenu title="Jogos">
                <MenuItem key={"/admin/matches/add"}>Adicionar</MenuItem>
                <MenuItem key={"/admin/matches/list"}>Listar</MenuItem>
            </SubMenu>
            <SubMenu title="Utilitários">
                <MenuItem key={"/admin/manage-persons"}>Gerir Pessoas</MenuItem>
            </SubMenu>
        </Menu>);
}

const animation = {
    enter(node, done) {
        let height;
        return animate(node, 'rc-menu-collapse', {
            start() {
                height = node.offsetHeight;
                node.style.height = 0;
            },
            active() {
                node.style.height = `${height}px`;
            },
            end() {
                node.style.height = '';
                done();
            },
        });
    },

    appear() {
        return this.enter.apply(this, arguments);
    },

    leave(node, done) {
        return animate(node, 'rc-menu-collapse', {
            start() {
                node.style.height = `${node.offsetHeight}px`;
            },
            active() {
                node.style.height = 0;
            },
            end() {
                node.style.height = '';
                done();
            },
        });
    },
};
