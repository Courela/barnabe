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
            user: null
        };

        this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
    }

    userHasAuthenticated = (authenticated, user, redirectTo) => {
        this.setState({ isAuthenticated: authenticated, user: user });

        if (authenticated) {
            const url = redirectTo ? redirectTo : "/season/" + new Date(Date.now()).getFullYear();
            this.props.history.push(url);
            this.forceUpdate(() => console.log('Updated: ' + JSON.stringify(this.props.history)));
        }
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            user: this.state.user,
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
