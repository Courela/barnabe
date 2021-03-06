import React, { Component } from "react";
import { withRouter } from 'react-router';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import Routes from "./Routes";
import TopMenu from "./components/TopMenu";
import "./styles/App.css";

class App extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        const { cookies } = props;

        console.log('Cookie');
        console.log(cookies);
        const cookieSession = cookies.get('barnabe');
        console.log(cookieSession);
        const user = sessionStorage.getItem('user');
        const teamId = sessionStorage.getItem('teamId');
        const username = sessionStorage.getItem('username');
        console.log('User: ' + JSON.stringify(user));
        console.log('TeamId: ' + teamId);
        this.state = {
            cookieName: cookieSession,
            isAuthenticated: user != null,
            user: user,
            teamId: teamId,
            username: username,
            isAdmin: false 
        };

        this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
    }

    userHasAuthenticated = (authenticated, user, redirectTo) => {
        this.setState({ 
            isAuthenticated: authenticated, 
            user: user, 
            teamId: user ? user.TeamId : null,
            username: user ? user.Username : null,
            isAdmin: user && !user.TeamId
        }, () => {
            if (this.state.isAuthenticated) {
                sessionStorage.setItem('user', this.state.user);
                sessionStorage.setItem('teamId', this.state.user ? this.state.user.TeamId : null);
                sessionStorage.setItem('username', this.state.user ? this.state.user.Username : null);
                const url = redirectTo ? 
                    redirectTo : 
                    this.state.isAdmin ? '/admin' : "/seasons/" + new Date(Date.now()).getFullYear();
                //console.log('Will redirect to: ', url)
                this.props.history.push(url);
                //this.forceUpdate(() => console.log('Updated: ' + JSON.stringify(this.props.history)));
            }
            else {
                const url = redirectTo ? 
                    redirectTo : 
                    '/login';
                this.props.history.push(url);
            }
        });
    }

    render() {
        //console.log('App props: ', this.props);
        const year = this.props.match && this.props.match.params && this.props.match.params.year ? this.props.match.params.year : 0;

        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            user: this.state.user,
            teamId: this.state.teamId,
            username: this.state.username,
            userHasAuthenticated: this.userHasAuthenticated,
            year: year
        };

        return (
            <div className="App container">
                <TopMenu isAuthenticated={this.state.isAuthenticated} username={this.state.username}
                    userHasAuthenticated={this.userHasAuthenticated} />
                <Routes /*{...this.props}*/ childProps={childProps} />
            </div>
        );
    }
}

export default withRouter(withCookies(App));
