import React, { Component } from "react";
import { withRouter } from 'react-router';
import Routes from "./Routes";
import TopMenu from "./components/TopMenu";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            username: null
        };

        this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
    }

    userHasAuthenticated = (authenticated, username) => {
        //console.log('App authenticate: ' + authenticated);
        this.setState({ isAuthenticated: authenticated, username: username });

        //console.log('Date: ' + Date.now().getFullYear());
        this.props.history.push("/season/" + Date.now());
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        return (
            <div className="App container">
                <TopMenu isAuthenticated={this.state.isAuthenticated} userHasAuthenticated={this.userHasAuthenticated} />
                <Routes childProps={childProps} />
            </div>
        );
    }
}

export default withRouter(App);
