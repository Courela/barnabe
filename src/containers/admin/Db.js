import React from 'react';
import { getDbPing } from '../../utils/communications';

export default class Db extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            db: null
        };
    }

    componentDidMount() {
        getDbPing()
            .then(res => {
                this.setState({ db: res.data.status });
            })
            .catch(err => console.error(err));
    }

    render() {
        return (
            <div>
                {this.state.db ? <DbDetail data={this.state.db} /> : ''}
            </div>);
    }
}

function DbDetail(props) {
    return (
        <div>
            Database ping: {props.data}
        </div>);
}