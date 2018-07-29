function validateNotEmpty(str) {
    if (!str || str === '') return 'error';
    return null;
};

function isValidEmail(email) {
    return (!email || email === '' || email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i));
}

function isValidPhone(phoneNr) {
    console.log('PhoneNr: ', phoneNr);
    return (!phoneNr || phoneNr === '' || phoneNr.replace(/ /g, '').match(/^(\+351|00351|351)?(9[1236][0-9]{7}|2[1-9][0-9]{7})$/));
}

function isCaretakerRequired(steps, stepId, roleId, birthdate, eighteenDate) {
    let result = false;
    if (roleId && roleId == 1) {
        const filter = steps.filter(s => s.id == stepId);
        if (filter && filter.length > 0) {
            result = filter[0].isCaretakerRequired ||
                (isValidDate(birthdate) && eighteenDate && new Date(birthdate) > eighteenDate);
        }
    }
    return result;
}

function isValidDate(date) {
    let result = false;
    try {
        result = new Date(date) != 'Invalid Date';
    }
    catch (err) { }
    return result;
}

export {
    validateNotEmpty,
    isValidEmail,
    isValidPhone,
    isValidDate,
    isCaretakerRequired
}