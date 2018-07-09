import React, { Component, Fragment } from 'react';
import {
    FormGroup, FormControl, ControlLabel, HelpBlock,
    Button, Panel, Image
} from 'react-bootstrap';
import axios from 'axios';
import settings from '../settings';

export default class GoogleApiForm extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            fileContent: null,
            url: '',
            authCode: '',
            isAuthorized: false
        };

        this.handleFile = this.handleFile.bind(this);
        this.handleSubmitSecret = this.handleSubmitSecret.bind(this);
        this.handleSubmitCode = this.handleSubmitCode.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        const url = settings.API_URL + '/api/admin/drive';
        axios.get(url)
            .then(result => {
                if (!result.data.success) {
                    if (result.data.nextStep === 'secret') {
                        return;
                    }
                    if (result.data.nextStep === 'token') {
                        this.setState({ isAuthorized: result.data.success, url: result.data.url });    
                    }
                }
                else {
                    this.setState({ isAuthorized: result.data.success });
                }
            })
            .catch(err => console.error(err));
    }

    handleControlChange(evt) {
        //console.log(evt);
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmitSecret(evt) {
        const url = settings.API_URL + '/api/admin/client-secret';
        const data = {
            file: this.state.fileContent
        };
        axios.post(url, data)
            .then(result => {
                console.log(result);
            })
            .catch((err) => {
                console.error(err);
            });

        evt.preventDefault();
    }

    handleSubmitCode(evt) {
        const url = settings.API_URL + '/api/admin/auth-code';
        const data = {
            authCode: this.state.authCode
        };
        axios.post(url, data)
            .then(result => {
                console.log(result);
            })
            .catch((err) => {
                console.error(err);
            });

        evt.preventDefault();
    }

    handleFile(evt) {
        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            let self = this;
            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    self.setState({ fileContent: e.target.result });
                    // Render thumbnail.
                    // var span = document.createElement('span');
                    // span.innerHTML = ['<img class="thumb" src="', e.target.result,
                    //     '" title="', escape(theFile.name), '"/>'].join('');
                    // document.getElementById('list').insertBefore(span, null);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
    }

    handleReset(evt) {
        const url = settings.API_URL + '/api/admin/reset-auth';
        axios.post(url, {})
            .then(result => {
                console.log(result);
                this.setState({ isAuthorized: false, url: '', authCode: '', fileContent: null });
            })
            .catch((err) => {
                console.error(err);
            });

        evt.preventDefault();
    }

    render() {
        if (this.state.isAuthorized) {
            return (
                <Fragment>
                    <div>
                        <h3>Google Drive Authorization Status</h3>
                        <p>Authorized</p>
                        <Button bsStyle="primary" onClick={this.handleReset}>Reset</Button>
                    </div>
                    <BackupData />
                </Fragment>
            );
        }
        if (this.state.url === '') {
            return (
                <form>
                    <FieldGroup
                        id="formFile"
                        type="file"
                        label="Client Secret File"
                        help="Client Secret File"
                        onChange={this.handleFile}
                    />
                    <Button bsStyle="primary" type="submit" onClick={this.handleSubmitSecret}>Post</Button>
                </form>);
        }
        else {
            return (<div>
                <a href={this.state.url} target="_blank">{this.state.url}</a>
                <form>
                    <FieldGroup
                        id="formCode"
                        type="text"
                        name="authCode"
                        label="Google Api Code"
                        placeholder=""
                        onChange={this.handleControlChange.bind(this)}
                    />
                </form>
                <Button bsStyle="primary" type="submit" onClick={this.handleSubmitCode}>Confirm</Button>
            </div>);
        }
    }
}

class BackupData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            success: false,
            message: ''
        }

        this.handleBackup = this.handleBackup.bind(this);
    }

    handleBackup(evt) {
        const url = settings.API_URL + '/api/admin/save-data';
        axios.get(url)
            .then(result => {
                console.log(result);
                if (result.data.isSuccess) {
                    this.setState({ success: true, message: 'Data was saved.' });
                }
                else {
                    this.setState({ success: false, message: 'Failed to save data!' });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    render() {
        return (
            <div>
                <h3>Backup Data to Google Drive</h3>
                <Button bsStyle="primary" onClick={this.handleBackup}>Backup</Button>&nbsp;
                <span style={{ color: this.state.success ? 'green' : 'red' }}>{this.state.message}</span>
            </div>
        );
    }
}

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}
