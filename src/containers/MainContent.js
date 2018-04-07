import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';

export default class MainContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            path: props.path
        }
    }
    render() {
        return (<div>{ this.state.path ? (<Redirect push to={this.state.path} />) : "" }</div>)
    }
}

{/* <Switch>
            <Route path="/season/:year/team/:teamId" component={Team} />
            <Route path="/season/:year/player/:playerId" component={Player} />
            <Route path="/season/:year" render={(props) => (<div>Época {this.state.season}</div>)} /> 
            <Route component={NotFound} />
        </Switch> */}