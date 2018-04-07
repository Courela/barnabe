import React, { Component } from 'react';
import { Route } from "react-router-dom";
import LeftMenu from "../components/LeftMenu";
import MainContent from './MainContent';

export default class Season extends Component {
    render() {
        return (
            <div>
                <div style={{ float: 'left' }}>
                    <Route path="/season/:year" component={LeftMenu} />
                </div>
                <Route path="/season/:year" component={MainContent} />
            </div>);
    }
}