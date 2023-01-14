import React, { Component } from 'react';
import { Route } from "react-router-dom";
import MainContent from '../components/MainContent';
import SideMenu from '../components/SideMenu';
import errors from '../components/Errors';
import { isValidDate } from '../utils/validations';
import { getSeason } from '../utils/communications';
import "../styles/Content.css";

export default class Content extends Component {
    constructor(props) {
        super(props);

        var year = 0;
        try {
            year = parseInt(props.match.params.year, 10);
        } catch {}

        this.state = {
            year: year,
            isSeasonActive: false,
            isSignUpExpired: true,
            eighteenDate: null
        }
    }

    componentDidUpdate() {
        // console.log("Content updated: ", this.props, this.state);
        var year = 0;
        try {
            year = parseInt(this.props.match.params.year, 10);
        } catch {}
        // console.log("Content after mount year: ", year);
        if (year && year !== this.state.year) {
            this.setState({ year: year });
        }

    }
    componentDidMount() {
        var year = 0;
        try {
            year = parseInt(this.props.match.params.year, 10);
        } catch {}
        // console.log("Content after mount year: ", year);
        if (year && year !== this.state.year) {
            this.getSeason(year);
        }
    }

    static async getDerivedStateFromProps(props, state) {
        var year = 0;
        try {
            year = parseInt(props.match.params.year, 10);
        } catch {}
        // console.log("Content after derived props year: ", year);
        if (year && year !== state.year) {
            return { year: year };
        }
        return null;
    }

    getSeason(year) {
        return getSeason(year)
            .then(season => {
                if (season) {
                    const isSeasonActive = season.is_active; 
                    const startDate = season.start_date;
                    let eighteenDate = null;
                    if (isValidDate(startDate)) {
                        eighteenDate = new Date(startDate);
                        eighteenDate.setFullYear(eighteenDate.getFullYear() - 18);
                    }
                    else {
                        console.warn("Invalid startDate: ", startDate);
                    }

                    return { 
                        year: season.year, 
                        isSeasonActive: isSeasonActive,
                        isSignUpExpired: isSeasonActive && (isSignUpExpired(season.sign_up_due_date) || this.isSignUpExpired(season.sign_up_extra_due_date)),
                        eighteenDate: eighteenDate
                    };
                }
            })
            .catch(errors.handleError);
    }

    render() {
        return (
            <div className="display-area">
                <div>
                    <Route key={this.state.year + 0} path="/admin" render={(props) => 
                        <SideMenu {...props} season={0} 
                            isAuthenticated={this.props.isAuthenticated} 
                            teamId={this.props.teamId} />} 
                    />
                    <Route key={this.state.year + 1} path="/seasons/:year" 
                        render={(props) => { 
                            // console.log("Build SideMenu props: ", props);
                            return <SideMenu {...props} 
                                season={props.match.params.year} 
                                isAuthenticated={this.props.isAuthenticated} 
                                teamId={this.props.teamId} isSeasonActive={this.state.isSeasonActive}
                            />}}
                    />
                </div>
                <div className="main-content">
                    <Route key={this.state.year + 2} path="/admin" render={(props) => 
                            <MainContent {...props} isAuthenticated={this.props.isAuthenticated} /> } />
                    <Route key={this.state.year + 3} path="/seasons/:year" 
                        render={(props) => 
                            <MainContent {...props} 
                                season={props.match.params.year}
                                teamId={this.props.teamId}
                                isSeasonActive={this.state.isSeasonActive}
                                isSignUpExpired={this.state.isSignUpExpired}
                                eighteenDate={this.state.eighteenDate}
                                isAuthenticated={this.props.isAuthenticated} /> } />
                </div>
            </div>);
    }
}

function isSignUpExpired(date) {
    let result = true;
    result = !(isValidDate(date) && new Date(date) > new Date());
    return result;
}