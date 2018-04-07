import React, { Component } from 'react';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';

function onOpenChange(value) {
    console.debug('onOpenChange', value);
}

export default class TopMenu extends Component {
    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
        this.onMenuSelect = props.onMenuSelect;
    }

    handleSelect(info) {
        //console.log(info);
        //console.log(`selected ${info.key}`);
        if (this.onMenuSelect) {
            console.log('TopMenu selected:' + info.key);
            this.onMenuSelect(info.key);
        }
    }

    render() {
        return (
            <div>
                <div style={{ width: '100%' }}>
                    <Menu onSelect={this.handleSelect} onOpenChange={onOpenChange} mode="horizontal" openAnimation="slide-up">
                        <SubMenu title={<span>Época</span>} key="1">
                            <MenuItem key="/season/2017">2017</MenuItem>
                            <MenuItem key="/season/2018">2018</MenuItem>
                        </SubMenu>
                        {/* {nestSubMenu} */}
                        <MenuItem disabled>disabled</MenuItem>
                        <MenuItem key="/torneio">Torneio</MenuItem>
                        <MenuItem key="/login">Login</MenuItem>
                    </Menu>
                </div>
            </div>);
    }
}