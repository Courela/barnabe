import React, { Component } from 'react';
import { Route } from "react-router-dom";
import axios from 'axios';
//import LeftMenu from "../components/LeftMenu";
import MainContent from '../components/MainContent';
import SideMenu from '../components/SideMenu';
import settings from '../settings';
import errors from '../components/Errors';
import { isValidDate } from '../utils/validations';
import "../styles/Season.css";

export default class Season extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: 0,
            isSeasonActive: false,
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

    componentWillReceiveProps(newProps) {
        const year = newProps.match.params.year;
        if (year && year !== this.state.year) {
            this.getSeason(year);
        }
    }

    getSeason(year) {
        const url = settings.API_URL + '/api/seasons/' + year;
        axios.get(url)
            .then(result => {
                //console.log(result);
                if (result.data) {
                    const isSeasonActive = result.data.IsActive &&
                        (!this.isSignUpExpired(result.data.SignUpDueDate) || !this.isSignUpExpired(result.data.SignUpExtraDueDate));
                    const startDate = result.data.StartDate;
                    let eighteenDate = null;
                    if (isValidDate(startDate)) {
                        eighteenDate = new Date(startDate);
                        eighteenDate.setFullYear(eighteenDate.getFullYear() - 18);
                    }

                    this.setState({ 
                        year: result.data.Year, 
                        isSeasonActive: isSeasonActive,
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
        //console.log('Render Season');
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
                                    eighteenDate={this.state.eighteenDate}
                                    isAuthenticated={this.props.isAuthenticated} /> } />
                    {/* </Switch> */}
                </div>
            </div>);
    }
}