import React, { Component } from "react";
import { Route } from 'react-router-dom';
import Routes from "./Routes";
import TopMenu from "./components/TopMenu";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            redirectTo: null,
            season: Date.now.year
        };

        this.handleMenuSelect = this.handleMenuSelect.bind(this);
    }

    handleMenuSelect(path) {
        if (path) {
            console.debug('New path: ' + path);
            const season = path.match('(?<=/season/)[0-9]{4}');
            console.debug('Selected season: ' + season);
            this.setState({ redirectTo: path, season: season ? season : this.state });
        }
    }

    userHasAuthenticated = authenticated => {
        console.log('App authenticate: ' + authenticated);
        this.setState({ isAuthenticated: authenticated });
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        return (
            <div className="App container">
                <Route path="/" render={(props) => <TopMenu {...props} isAuthenticated={this.state.isAuthenticated} /> } />
                <Routes childProps={childProps} />
            </div>
        );
    }
}

export default App;
