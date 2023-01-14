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

        const cookieSession = cookies.get('barnabe');
        const user = sessionStorage.getItem('user');
        const teamId = sessionStorage.getItem('teamId');
        const username = sessionStorage.getItem('username');
        this.state = {
            cookieName: cookieSession,
            isAuthenticated: user != null,
            user: user,
            teamId: teamId,
            username: username,
            isAdmin: false,
            year: 0
        };

        this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
    }

    userHasAuthenticated = async (authenticated, user, redirectTo) => {
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
            }
            else {
                const url = redirectTo ? 
                    redirectTo : 
                    '/login';
                this.props.history.push(url);
            }
        });
    }

    onSeasonChange(year) {
        console.log("Received year: ", year);
        if (this.state && this.state.year !== year) {
            this.setState({ year: year });
        }
    }

    render() {
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
                    teamId={this.state.teamId} userHasAuthenticated={this.userHasAuthenticated} 
                    onSeasonChange={this.onSeasonChange} />
                <Routes season={this.state.year} childProps={childProps} />
            </div>
        );
    }
}

export default withRouter(withCookies(App));
