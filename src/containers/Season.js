import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
//import LeftMenu from "../components/LeftMenu";
import MainContent from '../components/MainContent';
import SideMenu from '../components/SideMenu';

export default class Season extends Component {
    constructor(props) {
        super(props);

        this.navigate = this.navigate.bind(this);
    }

    navigate(url) {
        this.props.history.push(url);
    }
    
    render() {
        //console.log('Render Season');
        return (
            <div>
                <div style={{ float: 'left' }}>
                    <Route path="/season/:year" 
                        render={(props) => 
                            <SideMenu season={props.match.params.year} 
                                isAuthenticated={this.props.isAuthenticated} 
                                teamId={this.props.user ? this.props.user.TeamId : null} 
                                navigate={this.navigate}/>} />
                </div>
                <div style={{ display: 'inline', marginLeft: 10 }}>
                    {/* <Switch>
                        <Route path="/season/:year/step/:stepId" exact 
                            render={(props) => 
                                <MainContent {...props} isAuthenticated={this.props.isAuthenticated} 
                                    teamId={this.props.user ? this.props.user.TeamId : null}  
                                    stepId={props.match.params.stepId} /> } /> */}
                        <Route path="/season/:year" 
                            render={(props) => 
                                <MainContent {...props} isAuthenticated={this.props.isAuthenticated} teamId={this.props.user ? this.props.user.TeamId : null} /> } />
                    {/* </Switch> */}
                </div>
            </div>);
    }
}