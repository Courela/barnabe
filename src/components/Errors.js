import localization from "../localization";
import { vsprintf } from "sprintf-js";

localization.setLanguage('pt');

export default function handleError(err, errorMsgs, placeholderValues) {
    console.error(err);
    let msg = null;

    if (err.response.data && err.response.data.code) {
        msg = vsprintf(localization[err.response.data.code], placeholderValues ? placeholderValues : err.response.data.ids);
    } else if (err && err.response && err.response.status) {
        switch (err.response.status) {
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

    if (!msg) {
        msg = localization.ERR_000;
    }
    alert(msg);
    return null;
}
