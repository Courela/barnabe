/* eslint no-console:0 */

import React, { Component } from 'react';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu/lib';
import 'rc-menu/assets/index.css';
import animate from 'css-animation/lib';
import axios from 'axios';
import settings from '../settings';
import errors from './Errors';

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
        //this.onOpenChange = this.onOpenChange.bind(this);
        this.getTeams = this.getTeams.bind(this);
        this.getTeamSteps = this.getTeamSteps.bind(this);
        this.teamsMenu = this.teamsMenu.bind(this);
        this.stepsMenu = this.stepsMenu.bind(this);
        this.buildTeamsMenuItems = this.buildTeamsMenuItems.bind(this);
        this.getTeamSteps = this.getTeamSteps.bind(this);
    }

    componentDidMount() {
        //console.log('SideMenu: ' + this.props.isAuthenticated +';' +  this.props.teamId);
        if (this.props.teamId) {
            if (this.props.isAuthenticated) {
                this.getTeamSteps();
            } else {
                this.getTeams();
            }
        }
    }

    componentWillReceiveProps(newProps) {
        //console.log('New season: ', newProps.match.params.year);
        if (newProps.match.params.year) {
            this.setState({ season: newProps.match.params.year });
        }
    }

    getTeams() {
        if (this.state.season > 0) {
            //console.log(settings.API_URL);
            axios.get(settings.API_URL + '/api/teams?season=' + this.state.season)
                .then((res) => this.setState({ teams: res.data }))
                .catch(errors.handleError);
        }
    }

    handleSelect(info) {
        if (info.key) {
            //console.log('Url to navigate: ', info.key)
            this.props.history.push(info.key);
        }
    }

    onOpenChange(value) {
        //console.log('onOpenChange', value);
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
        this.state.teams.forEach(element => {
            menuItems.push(<MenuItem key={"/seasons/" + this.state.season + "/teams/" + element.Id}>{element.ShortDescription}</MenuItem>);
        });
        return menuItems;
    }

    getTeamSteps() {
        axios.get(settings.API_URL + '/api/seasons/' + this.state.season + '/teams/' + this.props.teamId + '/steps')
            .then((res) => this.setState({ steps: res.data }))
            .catch(errors.handleError);
    }

    stepsMenu() {
        let menuItems = [];
        this.state.steps.forEach(el => {
            menuItems.push(<MenuItem key={"/seasons/" + this.state.season + "/steps/" + el.StepId}>{el.Description}</MenuItem>);
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

        //console.log('Side menu teamdId: ', this.props.teamId);
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
            <MenuItem key={"/seasons/" + props.season + "/results"}>Resultados</MenuItem>
            <MenuItem key={"/seasons/" + props.season + "/standings"}>Classificação</MenuItem>
        </Menu>);
}
function AuthenticatedMenu(props) {
    const stepOptions = [
        <MenuItem key={"/seasons/" + props.season + "/add-step"}>Inscrever escalão</MenuItem>,
        <MenuItem key={"/seasons/" + props.season + "/remove-step"}>Remover escalão</MenuItem>
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
            <MenuItem key={"/admin/drive"}>Google Drive</MenuItem>
            <MenuItem key={"/admin/users"}>Crir Utilizador</MenuItem>
            <MenuItem key={"/admin/seasons"}>Gerir Épocas</MenuItem>
            <MenuItem key={"/admin/search"}>Procurar</MenuItem>
            <SubMenu title="Fichas de Jogo">
                <MenuItem key={"/admin/match-sheet"}>Jogo</MenuItem>
                <MenuItem key={"/admin/team-sheet"}>Equipa</MenuItem>
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
