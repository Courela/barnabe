function handleError(errResponse, errorMsgs) {
    console.log(JSON.stringify(errResponse));
    if (errResponse && errResponse.response && errResponse.response.status) {
        switch (errResponse.response.status) {
            case 400:
                alert('Campos obrigatórios em falta.');
                break;
            case 409:
                alert(errorMsgs.e409);
                break;
            default:
                unknownError();
                break;
        }
    } else { unknownError(); }
    return null;
}

function unknownError() {
    alert('Ocorreu um erro, tente outra vez mais tarde. ' +
        'Se o erro persistir contacte o administrador.');
}

module.exports = {
    handleError
}