import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Team from './Team';
import Player from './Player';
import NotFound from './NotFound';
import Results from './Results';
import Standings from './Standings';

export default class MainContent extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/season/:year/results" component={Results} />
                    <Route path="/season/:year/standings" component={Standings} />
                    <Route path="/season/:year/team/:teamId" component={Team} />
                    <Route path="/season/:year/player/:playerId" component={Player} />
                    <Route path="/season/:year" render={(props) => <div>Época {props.match.params.year}</div>} />
                    <Route component={NotFound} />
                </Switch>
            </div>);
    }
}
