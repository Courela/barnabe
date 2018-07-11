import React, { Component } from 'react';
import { Route } from "react-router-dom";
//import LeftMenu from "../components/LeftMenu";
import MainContent from '../components/MainContent';
import SideMenu from '../components/SideMenu';
import "../styles/Season.css";

export default class Season extends Component {
    constructor(props) {
        super(props);

        //this.navigate = this.navigate.bind(this);

        this.state = {
            //refresh: false,
            year: 0 
        }
    }

    componentDidMount() {
        //this.setState({ refresh: false });
    }

    componentWillReceiveProps(newProps) {
        this.setState({ year: newProps.match.params.year });
    }

    // navigate(url) {
    //     this.props.history.push(url);
    // }

    render() {
        //console.log('Render Season');
        return (
            <div className="display-area">
                <div>
                    <Route key={this.state.year + 1} path="/seasons/:year" 
                        render={(props) => 
                            <SideMenu {...props} season={props.match.params.year} 
                                isAuthenticated={this.props.isAuthenticated} 
                                teamId={this.props.teamId} 
                                /* navigate={this.navigate} */ />} />
                </div>
                <div className="main-content">
                    {/* <Switch>
                        <Route path="/seasons/:year/steps/:stepId" exact 
                            render={(props) => 
                                <MainContent {...props} isAuthenticated={this.props.isAuthenticated} 
                                    teamId={this.props.user ? this.props.user.TeamId : null}  
                                    stepId={props.match.params.stepId} /> } /> */}
                        <Route key={this.state.year + 2} path="/admin" exact render={(props) => 
                                <MainContent {...props} isAuthenticated={this.props.isAuthenticated} /> } />
                        <Route key={this.state.year + 3} path="/seasons/:year" 
                            render={(props) => 
                                <MainContent {...props} isAuthenticated={this.props.isAuthenticated} teamId={this.props.teamId} /> } />
                    {/* </Switch> */}
                </div>
            </div>);
    }
}