export function mapFromSeasonApi(seasonApi) {
    if (!seasonApi) {
        return null;
    }

    return {
        year: seasonApi.Year,
        is_active: seasonApi.IsActive,
        sign_up_due_date: seasonApi.SignUpDueDate,
        start_date: seasonApi.StartDate,
        sign_up_extra_due_date: seasonApi.SignUpExtraDueDate
    };
}

export function mapFromStepApi(stepApi) {
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

export function mapFromRoleApi(roleApi) {
    if (!roleApi) {
        return null;
    }

    return {
        id: roleApi.Id,
        description: roleApi.Description
    };
}

export function mapFromTeamApi(teamApi) {
    if (!teamApi) {
        return null;
    }

    return {
        id: teamApi.Id,
        short_description: teamApi.ShortDescription
    };
}

export function mapPersonFromApi(personApi) {
    if (!personApi) {
        return null;
    }

    var caretaker = null;
    if (personApi.Caretaker) {
        caretaker = mapPersonFromApi(personApi.Caretaker);
    }

    return {
        id: personApi.Id,
        name: personApi.Name,
        gender: personApi.Gender,
        birthdate: personApi.Birthdate,
        id_card_number: personApi.IdCardNr,
        id_card_expire_date: personApi.IdCardExpireDate,
        voter_nr: personApi.VoterNr,
        phone: personApi.Phone,
        email: personApi.Email,
        local_born: personApi.LocalBorn,
        local_town: personApi.LocalTown,
        caretaker: caretaker
    };
}

export function mapPlayerFromApi(playerApi) {
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
        step: mapFromStepApi(playerApi.Step),
        role: mapFromRoleApi(playerApi.Role),
        person: mapPersonFromApi(playerApi.Person),
        caretaker: mapPersonFromApi(playerApi.Caretaker) 
    };
}
