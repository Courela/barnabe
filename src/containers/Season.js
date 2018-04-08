import React, { Component } from 'react';
import { Route } from "react-router-dom";
//import LeftMenu from "../components/LeftMenu";
import MainContent from '../components/MainContent';
import SideMenu from '../components/SideMenu';

export default class Season extends Component {
    render() {
        //const leftMenu = <Route path="/season/:year" component={LeftMenu} />;

        return (
            <div>
                <div style={{ float: 'left' }}>
                    <Route path="/season/:year" 
                        render={(props) => 
                            <SideMenu {...props} isAuthenticated={this.props.isAuthenticated} />} />
                </div>
                <div style={{ display: 'inline', marginLeft: 10 }}>
                    <Route path="/season/:year" 
                        render={(props) => 
                            <MainContent {...props} isAuthenticated={this.props.isAuthenticated}/> } />
                </div>
            </div>);
    }
}