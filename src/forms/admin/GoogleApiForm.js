import React, { Component, Fragment } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { clientSettings } from '../../clientSettings';
import { FieldGroup } from '../../components/Controls';

export default class GoogleApiForm extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            fileContent: null,
            url: '',
            authCode: '',
            isAuthorized: true
        };

        this.checkStatus = this.checkStatus.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleSubmitSecret = this.handleSubmitSecret.bind(this);
        this.handleSubmitCode = this.handleSubmitCode.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        //this.checkStatus();
    }

    checkStatus() {
        const url = clientSettings.API_URL + '/api/admin/drive';
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
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    handleSubmitSecret(evt) {
        const url = clientSettings.API_URL + '/api/admin/client-secret';
        const data = {
            file: this.state.fileContent
        };
        axios.post(url, data)
            .then(result => {
                console.log(result);
                this.setState({ fileContent: null }, () => {
                    this.checkStatus();
                });
            })
            .catch((err) => {
                console.error(err);
            });

        evt.preventDefault();
    }

    handleSubmitCode(evt) {
        const url = clientSettings.API_URL + '/api/admin/auth-code';
        const data = {
            authCode: this.state.authCode
        };
        axios.post(url, data)
            .then(result => {
                console.log(result);
                this.setState({ url: null }, () => {
                    this.checkStatus();
                });
            })
            .catch((err) => {
                console.error(err);
            });

        evt.preventDefault();
    }

    handleFile(evt) {
        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; i < files.length; i++) {
            f = files[i];
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
        const url = clientSettings.API_URL + '/api/admin/reset-auth';
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
                    <BackupForm type='data' title='Backup Data to Google Drive'
                        successMessage='Data was saved' failMessage='Fail to save data!' />
                    <BackupForm type='users' title='Backup Users to Google Drive'
                        successMessage='Users were saved' failMessage='Fail to save users!' />
                    <BackupForm type='documents' title='Backup Documents to Google Drive'
                        successMessage='Documents were saved' failMessage='Fail to save documents!' />
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

class BackupForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            successBackup: false,
            successRestore: false,
            message: '',
            loadingBackup: false,
            loadingRestore: false
        }

        this.handleBackup = this.handleBackup.bind(this);
        this.handleRestore = this.handleRestore.bind(this);
    }

    handleBackup(evt) {
        this.setState({ loadingBackup: true }, () => {
            const url = clientSettings.API_URL + '/api/admin/save-' + this.props.type;
            axios.get(url)
                .then(result => {
                    console.log(result);
                    if (result.data.isSuccess) {
                        this.setState({ 
                            successBackup: true,
                            successRestore: false, 
                            message: this.props.successMessage, 
                            loadingBackup: false });
                    }
                    else {
                        this.setState({ 
                            successBackup: false, 
                            successRestore: false, 
                            message: this.props.failMessage, 
                            loadingBackup: false });
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        });
        evt.preventDefault();
    }

    handleRestore(evt) {
        if (window.confirm('About to restore ' + this.props.type + '! Are you sure?')) {
            this.setState({ loadingRestore: true }, () => {
                const url = clientSettings.API_URL + '/api/admin/restore-' + this.props.type;
                axios.get(url)
                    .then(result => {
                        console.log(result);
                        if (result.data.isSuccess) {
                            this.setState({ 
                                successRestore: true, 
                                successBackup: false, 
                                message: this.props.successMessage, 
                                loadingRestore: false });
                        }
                        else {
                            this.setState({ 
                                successRestore: false,
                                successBackup: false,
                                message: this.props.failMessage,
                                loadingRestore: false });
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            });
        }
        evt.preventDefault();
    }

    render() {
        return (
            <div>
                <h3>{this.props.title}</h3>
                <div style={{ margin: 2}}>
                    <Button bsStyle="success" onClick={this.handleBackup}>Backup</Button>&nbsp;
                    <span style={{ display: this.state.loadingBackup ? 'inline' : 'none' }}><img src="/show_loader.gif" alt="" style={{ height: '40px', width: '40px' }} /></span>
                    <span style={{ color: this.state.successBackup ? 'green' : 'red' }}>{this.state.message}</span>
                </div>
                <div style={{ margin: 2}}>
                    <Button bsStyle="danger" onClick={this.handleRestore}>Restore</Button>&nbsp;
                    <span style={{ display: this.state.loadingRestore ? 'inline' : 'none' }}><img src="/show_loader.gif" alt="" style={{ height: '40px', width: '40px' }} /></span>
                    <span style={{ color: this.state.successRestore ? 'green' : 'red' }}>{this.state.message}</span>
                </div>
            </div>
        );
    }
}
