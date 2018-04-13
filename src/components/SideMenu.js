/* eslint no-console:0 */

import React from 'react';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';
import animate from 'css-animation';

export default class SideMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            season: props.match.params.year
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);
    }

    handleSelect(info) {
        if (info.key) {
            this.props.history.push(info.key);
        }
    }

    onOpenChange(value) {
        console.log('onOpenChange', value);
    }

    render() {
        const anonymousMenu = (
            <Menu onSelect={this.handleSelect} onOpenChange={this.onOpenChange}
                mode="inline" openAnimation={animation}>
                <SubMenu title={<span>Equipas</span>} key="1">
                    <MenuItem key={"/season/" + this.state.season + "/team/1"}>Aruil</MenuItem>
                    <MenuItem key={"/season/" + this.state.season + "/team/2"}>Almargem</MenuItem>
                </SubMenu>
                <MenuItem key={"/season/" + this.state.season + "/results"}>Resultados</MenuItem>
                <MenuItem key={"/season/" + this.state.season + "/standings"}>Classificação</MenuItem>
                <MenuItem disabled>disabled</MenuItem>
            </Menu>);
        
        const authenticatedMenu = (
            <Menu onSelect={this.handleSelect} onOpenChange={this.onOpenChange}
                mode="inline" openAnimation={animation}>
                <MenuItem key={"/season/" + this.state.season + "/addstep"}>Inscrever escalão</MenuItem>
                <SubMenu title={<span>Escalões</span>} key="1">
                    <MenuItem key={"/season/" + this.state.season + "/step/1"}>Escolinhas</MenuItem>
                    <MenuItem key={"/season/" + this.state.season + "/step/2"}>III Escalão</MenuItem>
                </SubMenu>
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
