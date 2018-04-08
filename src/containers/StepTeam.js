import React, { Component } from 'react';

export default class StepTeam extends Component {
    render() {
        return (
            <div>
                <h2>Escalão {this.props.match.params.stepId}</h2>
            </div>);
    }
}