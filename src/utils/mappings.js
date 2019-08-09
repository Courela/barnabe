function mapFromStepApi(stepApi) {
    if (!stepApi) {
        return null;
    }

    return {
        id: stepApi.Id,
        description: stepApi.Description,
        gender: stepApi.Gender,
        is_caretaker_required: stepApi.IsCaretakerRequired,
        season: stepApi.Season,
        min_date: stepApi.MinDate,
        max_date: stepApi.MaxDate
    };
}

function mapFromRoleApi(roleApi) {
    if (!roleApi) {
        return null;
    }

    return {
        id: roleApi.Id,
        description: roleApi.Description
    };
}

function mapPersonFromApi(personApi) {
    if (!personApi) {
        return null;
    }

    return {
        id: personApi.Id,
        name: personApi.Name,
        gender: personApi.Gender,
        birthdate: personApi.Birthdate,
        id_card_number: personApi.IdCardNumber,
        id_card_expire_date: personApi.IdCardExpireDate,
        voter_nr: personApi.VoterNr,
        phone: personApi.Phone,
        email: personApi.Email,
        local_born: personApi.LocalBorn
    };
}

function mapPlayerFromApi(playerApi) {
    if (!playerApi) {
        return null;
    }

    return {
        id: playerApi.Id,
        season: playerApi.Season,
        team_id: playerApi.TeamId,
        step_id: playerApi.StepId,
        person_id: playerApi.PersonId,
        role_id: playerApi.RoleId,
        is_resident: playerApi.Resident,
        caretaker_id: playerApi.CareTakerId,
        comments: playerApi.Comments,
        photo_filename: playerApi.PhotoFilename,
        doc_filename: playerApi.DocFilename,
        step: mapFromStepApi(playerApi.step),
        role: mapFromRoleApi(playerApi.role),
        person: mapPersonFromApi(playerApi.person),
        caretaker: mapPersonFromApi(playerApi.caretaker) 
    };
}