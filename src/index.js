import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { CookiesProvider } from 'react-cookie';
import axios from 'axios';
import { clientSettings } from './clientSettings';

//import "./index.css";

ReactDOM.render(
    <CookiesProvider>
        <BrowserRouter>
            <Switch>
                <Route path="/api" component={Api} />
                <Route path="*" component={App} />
            </Switch>
        </BrowserRouter>
    </CookiesProvider>,
    document.getElementById("root")
);
registerServiceWorker();

function Api(props) {
    const url = clientSettings.API_URL + props.location.pathname + (props.location.search ? props.location.search : '');
    if (props.location.pathname.indexOf('api/files') > -1) {
        //console.log('Redirect to ', url);
        window.location.href = url;
    }
    else {
        let apiResponse = CallApi(clientSettings.API_URL + props.location.pathname + (props.location.search ? props.location.search : ''));
        return (<div>
            {JSON.stringify(apiResponse)}
        </div>);
    }
}

async function CallApi(url) {
    let apiResponse = await axios.get(url)
        .then(res => res.data)
        .catch(err => {
            console.error(err);
            var errorObj = { msg: 'Unexpected error!' }
            throw errorObj;
        });
    return apiResponse;
}
