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

        this.state = {
            year: 0,
            isSeasonActive: false,
            isSignUpExpired: true,
            eighteenDate: null,
            stepId: 0,
            stepName: "",
        }

        this.onStepChange = this.onStepChange.bind(this);
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

    async componentDidMount() {
        var year = 0;
        try {
            year = parseInt(this.props.match.params.year, 10);
        } catch {}
        // console.log("Content after mount year: ", year);
        if (year && year !== this.state.year) {
            var season = await this.getSeason(year);
            this.setState({
                year: season.year,
                isSeasonActive: season.isSeasonActive,
                isSignUpExpired: season.isSignUpExpired,
                eighteenDate: season.eighteenDate
            });
        }
    }

    static async getDerivedStateFromProps(props, state) {
        var year = 0;
        try {
            year = parseInt(props.match.params.year, 10);
        } catch(err) {
            console.log(err);
        }
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
                        isSignUpExpired: isSeasonActive && (isSignUpExpired(season.sign_up_due_date) || isSignUpExpired(season.sign_up_extra_due_date)),
                        eighteenDate: eighteenDate
                    };
                }
            })
            .catch(errors.handleError);
    }

    onStepChange(stepId, stepName) {
        this.setState({ stepId: stepId, stepName: stepName });
    }

    render() {
        var year = parseInt(this.state.year, 10);
            year = !isNaN(year) ? year : 0;
        return (
            <div className="display-area">
                <div>
                    <Route key={year + 0} path="/admin" render={(props) => 
                        <SideMenu {...props} season={0} 
                            isAuthenticated={this.props.isAuthenticated} 
                            teamId={this.props.teamId} onStepChange={this.onStepChange} />} 
                    />
                    <Route key={year + 1} path="/seasons/:year" stepId={this.state.stepId}
                        render={(props) => { 
                            // console.log("Build SideMenu props: ", props);
                            return <SideMenu {...props} 
                                season={props.match.params.year} 
                                isAuthenticated={this.props.isAuthenticated} 
                                teamId={this.props.teamId} isSeasonActive={this.state.isSeasonActive}
                                onStepChange={this.onStepChange}
                            />}}
                    />
                </div>
                <div className="main-content">
                    <Route key={year + 2} path="/admin" render={(props) => 
                            <MainContent {...props} isAuthenticated={this.props.isAuthenticated} stepId={this.state.stepId}  stepName={this.state.stepName} /> } />
                    <Route key={year + 3} path="/seasons/:year" stepId={this.state.stepId}
                        render={(props) => 
                            <MainContent {...props} 
                                season={props.match.params.year}
                                teamId={this.props.teamId}
                                isSeasonActive={this.state.isSeasonActive}
                                isSignUpExpired={this.state.isSignUpExpired}
                                eighteenDate={this.state.eighteenDate}
                                isAuthenticated={this.props.isAuthenticated}
                                stepId={this.state.stepId} 
                                stepName={this.state.stepName} /> } />
                </div>
            </div>);
    }
}

function isSignUpExpired(date) {
    let result = true;
    result = !(isValidDate(date) && new Date(date) > new Date());
    return result;
}