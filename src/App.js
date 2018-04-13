import React, { Component } from "react";
import { withRouter } from 'react-router';
import Routes from "./Routes";
import TopMenu from "./components/TopMenu";
import "./styles/App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            username: null
        };

        this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
    }

    userHasAuthenticated = (authenticated, username, redirectTo) => {
        this.setState({ isAuthenticated: authenticated, username: username });

        if (authenticated) {
            //console.log('Authenticated: ' + JSON.stringify(this.props))
            //console.log('Date: ' + Date.now().getFullYear());
            //console.log('Redirect: ' + redirectTo);
            const url = redirectTo ? redirectTo : "/season/" + Date.now();
            this.props.history.push(url);
            this.forceUpdate(() => console.log('Updated: ' + JSON.stringify(this.props.history)));
        }
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
