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
        const filter = steps.filter(s => {
            //TODO check use of ===
            //console.log("isCaretakerRequired filter result: ", s.id == stepId);
            // eslint-disable-next-line
            return s.id == stepId;
        });
        if (filter && filter.length > 0) {
            //TODO Uniform steps array
            result = filter[0].is_caretaker_required ? filter[0].is_caretaker_required : false;
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
    const result = person.local_born || player.is_resident || (caretaker && caretaker.voter_nr) ? '' : (person.voter_nr ? '' : 'Sim');
    return result;
}

function isValidPlayer(player) {
    let result = false;
    
    const { name, gender, birthdate, id_card_number, phone, email /*, voter_nr*/ } = player.person;
    const { /*Resident,*/ photo_filename, doc_filename, caretaker } = player;

    result = name && gender && birthdate && id_card_number && isValidEmail(email) && isValidPhone(phone);
    result = result && (!caretaker || (caretaker && caretaker.name)); 
    //result = result && (!Resident || (Resident && (VoterNr || (caretaker && caretaker.VoterNr))));
    result = result && photo_filename && doc_filename;
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