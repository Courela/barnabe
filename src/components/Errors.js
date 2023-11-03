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
                msg = errorMsgs && errorMsgs.e400 ? errorMsgs.e400 : localization.ERR_400; 
                break;
            case 404:
                msg = errorMsgs && errorMsgs.e404 ? errorMsgs.e404 : localization.ERR_404; 
                break;
            case 409:
                msg = errorMsgs && errorMsgs.e409 ? errorMsgs.e409 : localization.ERR_409; 
                break;
            case 413:
                msg = errorMsgs && errorMsgs.e413 ? errorMsgs.e413 : localization.ERR_413;
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
