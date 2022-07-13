function validateNotEmpty(str) {
    if (!str || str === '') return 'error';
    return null;
};

function isValidEmail(email) {
    return (!email || email === '' || email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i));
}

function isValidPhone(phoneNr) {
    return (!phoneNr || phoneNr === '' || phoneNr.replace(/ /g, '').match(/^(\+351|00351|351)?(9[1236][0-9]{7}|2[1-9][0-9]{7})$/));
}

function isCaretakerRequired(steps, stepId, roleId, birthdate, eighteenDate) {
    let result = false;
    if (roleId && roleId === 1) {
        const filter = steps.filter(s => s ? s.Id === stepId || s.id === stepId : false);
        if (filter && filter.length > 0) {
            //TODO Uniform steps array
            result = filter[0].IsCaretakerRequired ? filter[0].IsCaretakerRequired : false ||
                filter[0].isCaretakerRequired ? filter[0].isCaretakerRequired : false;
            result = result || (isValidDate(birthdate) && eighteenDate && new Date(birthdate) > eighteenDate);
        }
    }
    return result;
}

function isValidDate(date) {
    return !isNaN(Date.parse(date));
}

function isResident(player) {
    const { person, caretaker } = player;
    const result = person.LocalBorn || player.Resident || (caretaker && caretaker.VoterNr) ? '' : (person.VoterNr ? '' : 'Sim');
    return result;
}

function isValidPlayer(player) {
    let result = false;
    
    const { Name, Gender, Birthdate, IdCardNr, Phone, Email /*, VoterNr*/ } = player.person;
    const { /*Resident,*/ PhotoFilename, DocFilename, caretaker } = player;

    result = Name && Gender && Birthdate && IdCardNr && isValidEmail(Email) && isValidPhone(Phone);
    result = result && (!caretaker || (caretaker && caretaker.Name)); 
    //result = result && (!Resident || (Resident && (VoterNr || (caretaker && caretaker.VoterNr))));
    result = result && PhotoFilename && DocFilename;
    return result;
}

export {
    validateNotEmpty,
    isValidEmail,
    isValidPhone,
    isValidDate,
    isCaretakerRequired,
    isResident,
    isValidPlayer
}