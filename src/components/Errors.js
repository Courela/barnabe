function handleError(errResponse, errorMsgs) {
    console.log(errResponse);
    let msg = 'Ocorreu um erro, tente outra vez mais tarde. ' +
        'Se o erro persistir contacte o administrador.';

    if (errResponse && errResponse.response && errResponse.response.status) {
        switch (errResponse.response.status) {
            case 400:
                msg = errorMsgs && errorMsgs.e400 ? errorMsgs.e400 : 'Campos obrigatórios em falta.'; 
                break;
            case 404:
                msg = errorMsgs && errorMsgs.e404 ? errorMsgs.e404 : 'Página não encontrada!'; 
                break;
            case 409:
                msg = errorMsgs && errorMsgs.e409 ? errorMsgs.e409 : 'Registo duplicado!'; 
                break;
            case 413:
                msg = errorMsgs && errorMsgs.e413 ? errorMsgs.e413 : 'Fotografia e/ou Ficha de Jogador demasiado grandes!'; 
                break;
            default:
                break;
        }
    }
    alert(msg);
    return null;
}

module.exports = {
    handleError
}