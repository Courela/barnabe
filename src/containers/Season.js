import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import LeftMenu from "../components/LeftMenu";
import NotFound from './NotFound';
import Team from './Team';
import Player from './Player';
import MainContent from './MainContent';
import Standings from './Standings';
import Results from './Results';

export default class Season extends Component {
    constructor(props) {
        super(props);

        this.state = {
            season: props.match.params.year ? props.match.params.year : Date.now.year,
            path: props.path
        };

        this.handleMenuSelect = this.handleMenuSelect.bind(this);
    }

    handleMenuSelect(path) {
        if (path) {
            console.debug('LeftMenu new path: ' + path);
            const season = path.match('(?<=/season/)[0-9]{4}');
            console.debug('LeftMenu selected season: ' + season);
            this.setState({ redirectTo: path, season: season ? season : this.state });
        }
    }
    
    render() {
        if (this.state.path) {
            return (<Redirect push to={this.state.path} />);
        }

        return (
            <div>
                <div style={{ float: 'left' }}>
                    <LeftMenu season={this.state.season} onMenuSelect={this.handleMenuSelect} />
                </div>
                <Route path="/season/:year/team/:teamId" component={Team} />
                <Route path="/season/:year/standings" component={Standings} />
                <Route path="/season/:year/results" component={Results} />
                <MainContent path={this.state.path} />
            </div>);
    }
}