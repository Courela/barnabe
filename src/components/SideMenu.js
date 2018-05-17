/* eslint no-console:0 */

import React from 'react';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';
import animate from 'css-animation';
import axios from 'axios';
import settings from '../settings';
import errors from '../components/Errors';

export default class SideMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            season: props.season,
            teams: [],
            steps: []
        };

        this.handleSelect = this.handleSelect.bind(this);
        //this.onOpenChange = this.onOpenChange.bind(this);
        this.getTeams = this.getTeams.bind(this);
        this.getTeamSteps = this.getTeamSteps.bind(this);
        this.teamsMenu = this.teamsMenu.bind(this);
        this.buildTeamsMenuItems = this.buildTeamsMenuItems.bind(this);
        this.getTeamSteps = this.getTeamSteps.bind(this);

        if (this.props.isAuthenticated && this.props.teamId) {
            this.getTeamSteps();
        } else {
            this.getTeams();
        }
    }

    getTeams() {
        //console.log(settings.API_URL);
        axios.get(settings.API_URL + '/api/team?season=' + this.state.season)
            .then((res) => this.setState({ teams: res.data })
            .catch(errors.handleError));
    }

    handleSelect(info) {
        if (info.key) {
            this.props.navigate(info.key);
            //this.props.history.push(info.key);
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
            menuItems.push(<MenuItem key={"/season/" + this.state.season + "/team/" + element.Id}>{element.ShortDescription}</MenuItem>);
        });
        return menuItems;
    }

    getTeamSteps() {
        axios.get(settings.API_URL + '/api/season/' + this.state.season + '/team/' + this.props.teamId + '/steps')
            .then((res) => this.setState({ steps: res.data }))
            .catch(errors.handleError);
    }

    stepsMenu() {
        let menuItems = [];
        this.state.steps.forEach(el => {
            menuItems.push(<MenuItem key={"/season/" + this.state.season + "/step/" + el.StepId}>{el.Description}</MenuItem>);
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
            <Menu onSelect={this.handleSelect} onOpenChange={this.onOpenChange}
                mode="inline" openAnimation={animation}>
                {this.teamsMenu()}
                <MenuItem key={"/season/" + this.state.season + "/results"}>Resultados</MenuItem>
                <MenuItem key={"/season/" + this.state.season + "/standings"}>Classificação</MenuItem>
                <MenuItem disabled>disabled</MenuItem>
            </Menu>);

        const authenticatedMenu = (
            <Menu onSelect={this.handleSelect} onOpenChange={this.onOpenChange}
                mode="inline" openAnimation={animation}>
                <MenuItem key={"/season/" + this.state.season + "/addstep"}>Inscrever escalão</MenuItem>
                {this.stepsMenu()}
                <MenuItem key={"/season/" + this.state.season + "/documents"}>Documentos</MenuItem>
            </Menu>);

        const menu = this.props.isAuthenticated ? authenticatedMenu : anonymousMenu;

        return (<div style={{ width: 150 }}>{menu}</div>);
    }
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
