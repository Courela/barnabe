import {Buffer} from 'buffer';

export function mapFromUserApi(userApi) {
    if (!userApi) {
        return null;
    }

    return {
        username: userApi.Username,
        password: userApi.Password,
        team_id: userApi.TeamId,
        team: mapFromTeamApi(userApi.Team)
    };
}

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
        name: teamApi.Name,
        short_description: teamApi.ShortDescription
    };
}

export function mapPersonFromApi(personApi) {
    if (!personApi) {
        return null;
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
        created_at: personApi.CreatedAt,
        last_updated_at: personApi.LastUpdatedAt
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
        //photo: playerApi.Photo ? decodeBase64(playerApi.Photo) : null,
        doc_filename: playerApi.DocFilename,
        //doc: playerApi.Doc ? decodeBase64(playerApi.Doc) : null,
        step: mapFromStepApi(playerApi.Step),
        role: mapFromRoleApi(playerApi.Role),
        person: mapPersonFromApi(playerApi.Person),
        caretaker: mapPersonFromApi(playerApi.Caretaker),
        created_at: playerApi.CreatedAt,
        last_updated_at: playerApi.LastUpdatedAt
    };
}

export function mapPhotoFromApi(photoApi) {
    if (!photoApi) {
        return null;
    }
    return decodeBase64(photoApi);
}

export function mapDocumentFromApi(docApi) {
    if (!docApi) {
        return null;
    }
    return decodeBase64(docApi);
}

export function mapPersonToApi(person) {
    if (!person) {
        return null;
    }

    return {
        Id: person.id,
        Name: person.name,
        Gender: person.gender,
        Birthdate: person.birthdate,
        IdCardNr: person.id_card_number,
        IdCardExpireDate: person.id_card_expire_date,
        VoterNr: person.voter_nr,
        Phone: person.phone,
        Email: person.email,
        LocalBorn: person.local_born,
        LocalTown: person.local_town
    };
}

export function mapPlayerToApi(player) {
    if (!player) {
        return null;
    }

    return {
        Id: player.id,
        Season: player.season,
        TeamId: player.team_id,
        StepId: player.step_id,
        PersonId: player.person_id,
        RoleId: player.role_id,
        Resident: player.is_resident,
        CaretakerId: player.careTaker_id,
        Comments: player.comments,
        PhotoFilename: player.photo_filename,
        Photo: player.photo,
        DocFilename: player.doc_filename,
        Doc: player.doc,
        Person: mapPersonToApi(player.person),
        Caretaker: mapPersonToApi(player.caretaker)
    };
}

function decodeBase64(data) {
    let buff = Buffer.from(data, 'base64');  
    return buff.toString('utf-8');
}