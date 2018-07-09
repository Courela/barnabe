import React, { Component } from 'react';
import { Route } from "react-router-dom";
//import LeftMenu from "../components/LeftMenu";
import MainContent from '../components/MainContent';
import SideMenu from '../components/SideMenu';
import "../styles/Season.css";

export default class Season extends Component {
    constructor(props) {
        super(props);

        this.navigate = this.navigate.bind(this);
        this.refresh = this.refresh.bind(this);

        this.state = {
            refresh: false
        }
    }

    componentDidMount() {
        this.setState({ refresh: false });
    }

    navigate(url) {
        this.props.history.push(url);
        this.refresh();
    }

    refresh() {
        console.log('Force update!');
        //this.forceUpdate();
        window.location.reload();
    }
    
    render() {
        //console.log('Render Season');
        return (
            <div className="display-area">
                <div>
                    <Route path="/season/:year" 
                        render={(props) => 
                            <SideMenu season={props.match.params.year} 
                                isAuthenticated={this.props.isAuthenticated} 
                                teamId={this.props.teamId} 
                                navigate={this.navigate}/>} />
                </div>
                <div className="main-content">
                    {/* <Switch>
                        <Route path="/season/:year/step/:stepId" exact 
                            render={(props) => 
                                <MainContent {...props} isAuthenticated={this.props.isAuthenticated} 
                                    teamId={this.props.user ? this.props.user.TeamId : null}  
                                    stepId={props.match.params.stepId} /> } /> */}
                        <Route path="/season/:year" 
                            render={(props) => 
                                <MainContent {...props} isAuthenticated={this.props.isAuthenticated} teamId={this.props.teamId} refresh={this.state.refresh}/> } />
                    {/* </Switch> */}
                </div>
            </div>);
    }
}