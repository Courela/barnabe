import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { FieldGroup } from '../../components/Controls';
import { loadDocument } from '../../utils/communications';
import errors from '../../components/Errors';

export default class LoadDocuments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            type: '',
            link: '',
            document: ''
        };

        this.handleControlChange = this.handleControlChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleControlChange(evt) {
        let fieldName = evt.target.name;
        let fieldVal = evt.target.value;
        this.setState({ [fieldName]: fieldVal });
    }

    handleDoc(evt) {
        var files = evt.target.files; // FileList object

        let self = this;
        const onload = function (theFile) {
            return function (e) {
                self.setState({ doc: reader.result });
                //self.setState({ doc: window.btoa(reader.result) });
            };
        };
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; i < files.length; i++) {
            f = files[i]

            if (f.type.match('image.*') || f.type.match('application.pdf')) {
                var reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = (onload)(f);

                reader.readAsDataURL(f);
                //reader.readAsBinaryString(f);
            }
        }
    }

    handleSubmit(evt) {
        const { name, type, link } = this.state;
        console.log('Submitting document: ', name, type, link);
        loadDocument(name, type, link)
            .then(result => {
                if (result) {
                    alert('Documento carregado.');
                }
            })
            .catch((err) => {
                errors.handleError(err);
            });
        //alert('Campos obrigatórios em falta!');
        evt.preventDefault();
    }

    render() {
        return (
            <form>
                <FieldGroup
                    id="formName"
                    type="text"
                    name="name"
                    label="Nome"
                    placeholder="Nome"
                    onChange={this.handleControlChange}
                />
                <FieldGroup
                    id="formType"
                    type="text"
                    name="type"
                    label="Tipo"
                    placeholder="Tipo"
                    onChange={this.handleControlChange}
                />
                <FieldGroup
                    id="formLink"
                    type="text"
                    name="link"
                    label="Hiperligação"
                    placeholder="Hiperligação"
                    onChange={this.handleControlChange}
                />
                <FieldGroup
                    id="formDocument"
                    type="file"
                    label="Documento"
                    help="Documento"
                    onChange={this.handleDoc}
                    accept="image/*,application/pdf"
                />
                <div style={{ display: 'flex', flexDirection: 'row-reverse', padding: '5px' }}>
                    <Button bsStyle="primary" type="submit" onClick={this.handleSubmit} style={{ margin: '3px' }}>
                        Carregar
                    </Button>
                </div>
            </form>
        );
    }
}