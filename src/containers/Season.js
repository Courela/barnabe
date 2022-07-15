import React, { Component } from 'react';
import { Route } from "react-router-dom";
import MainContent from '../components/MainContent';
import SideMenu from '../components/SideMenu';
import errors from '../components/Errors';
import { isValidDate } from '../utils/validations';
import "../styles/Season.css";
import { getSeason } from '../utils/communications';

export default class Season extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: 0,
            isSeasonActive: false,
            isSignUpExpired: true,
            eighteenDate: null
        }

        this.getSeason = this.getSeason.bind(this);
    }

    componentDidMount() {
        const year = this.props.match.params.year;
        if (year && year !== this.state.year) {
            this.getSeason(year);
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const year = newProps.match.params.year;
        if (year && year !== this.state.year) {
            this.getSeason(year);
        }
    }

    getSeason(year) {
        getSeason(year)
            .then(season => {
                //console.log("Season getSeason: ", season);
                if (season) {
                    const isSeasonActive = season.is_active; 
                    const startDate = season.start_date;
                    let eighteenDate = null;
                    if (isValidDate(startDate)) {
                        //console.log("Season startDate: ", startDate);
                        eighteenDate = new Date(startDate);
                        eighteenDate.setFullYear(eighteenDate.getFullYear() - 18);
                        //console.log("Season eighteenDate: ", eighteenDate);
                    }
                    else {
                        console.warn("Invalid startDate: ", startDate);
                    }

                    this.setState({ 
                        year: season.year, 
                        isSeasonActive: isSeasonActive,
                        isSignUpExpired: isSeasonActive && (this.isSignUpExpired(season.sign_up_due_date) || this.isSignUpExpired(season.sign_up_extra_due_date)),
                        eighteenDate: eighteenDate
                    });
                    //this.setState({ stepName: result.data.Description });
                }
            })
            .catch(errors.handleError);
    }

    isSignUpExpired(date) {
        let result = true;
        result = !(isValidDate(date) && new Date(date) > new Date());
        return result;
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
                        render={(props) => 
                            <SideMenu {...props} season={props.match.params.year} 
                                isAuthenticated={this.props.isAuthenticated} 
                                teamId={this.props.teamId} isSeasonActive={this.state.isSeasonActive}
                                /* navigate={this.navigate} */ />} />
                </div>
                <div className="main-content">
                    {/* <Switch>
                        <Route path="/seasons/:year/steps/:stepId" exact 
                            render={(props) => 
                                <MainContent {...props} isAuthenticated={this.props.isAuthenticated} 
                                    teamId={this.props.user ? this.props.user.TeamId : null}  
                                    stepId={props.match.params.stepId} /> } /> */}
                        <Route key={this.state.year + 2} path="/admin" render={(props) => 
                                <MainContent {...props} isAuthenticated={this.props.isAuthenticated} /> } />
                        <Route key={this.state.year + 3} path="/seasons/:year" 
                            render={(props) => 
                                <MainContent {...props} teamId={this.props.teamId}
                                    isSeasonActive={this.state.isSeasonActive}
                                    isSignUpExpired={this.state.isSignUpExpired}
                                    eighteenDate={this.state.eighteenDate}
                                    isAuthenticated={this.props.isAuthenticated} /> } />
                    {/* </Switch> */}
                </div>
            </div>);
    }
}