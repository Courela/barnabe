import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { CookiesProvider } from 'react-cookie';
import axios from 'axios';
import settins from './settings';

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
    console.log(props);
    let apiResponse = CallApi(settins.API_URL + props.location.pathname);
    console.log(apiResponse);
    return (<div>
        {JSON.stringify(apiResponse)}
    </div>);
}

async function CallApi(url) {
    let apiResponse;
    await axios.get(url).then(res => { apiResponse = res.data; return res.data; });
    return apiResponse;
    //return apiResponse;
}
