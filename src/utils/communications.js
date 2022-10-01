import axios from 'axios';
import settings from '../settings';
import errors from '../components/Errors';
import { 
    mapFromUserApi, 
    mapFromSeasonApi, 
    mapFromRoleApi, 
    mapFromStepApi, 
    mapFromTeamApi, 
    mapPersonFromApi, 
    mapPlayerFromApi,
    mapPlayerToApi,
    mapPhotoFromApi,
    mapDocumentFromApi
} from './mappings';

const options = {
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: settings.PLAYER_REQUEST_TIMEOUT
};

export function getSeasons() {
    const url = settings.API_URL + '/api/seasons';
    return getRequest(url)
        .then(r => {
            var result = [];
            if (r.data && r.data.length > 0) {
                r.data.forEach(el => {
                    result.push(mapFromSeasonApi(el));
                });
            } else {
                console.error("error getting response: getSeasons = ", r)
            }
            return result;
        })
        .catch(errors.handleError);
}

export function getRoles() {
    const url = settings.API_URL + '/api/roles';
    return getRequest(url)
        .then(r => {
            var steps = [];
            if (r.data && r.data.length > 0) {
                r.data.forEach(el => {
                    steps.push(mapFromRoleApi(el));
                });
            } else {
                console.error("error getting response: getRoles = ", r)
            }
            return steps;
        })
        .catch(errors.handleError);
}

export function getSteps() {
    const url = settings.API_URL + '/api/steps';
    return getRequest(url)
        .then(r => {
            var steps = [];
            if (r.data && r.data.length > 0) {
                r.data.forEach(el => {
                    steps.push(mapFromStepApi(el));
                });
            } else {
                console.error("error getting response: getSteps = ", r)
            }
            return steps;
        })
        .catch(errors.handleError);
}

export function getActiveSeason() {
    return getSeasons()
        .then(res => res.find(s => s.is_active))
        .catch(errors.handleError);
}

export function getSeason(season) {
    const url = settings.API_URL + '/api/seasons/' + season;
    return getRequest(url)
        .then(r => mapFromSeasonApi(r.data))
        .catch(errors.handleError);
}

export function getTeams(season) {
    var url = settings.API_URL + '/api/teams';
    if (season) {
        url += '?season=' + season;
    }
    return getRequest(url)
        .then(r => {
            var teams = [];
            if (r.data && r.data.length > 0) {
                r.data.forEach(el => {
                    teams.push(mapFromTeamApi(el));
                });
            } else {
                console.error("error getting response: getTeams = ", r)
            }
            return teams;
        })
        .catch(errors.handleError);
}

export function getTeam(teamId) {
    const url = settings.API_URL + '/api/teams/' + teamId;
    return getRequest(url)
        .then(r => mapFromTeamApi(r.data))
        .catch(errors.handleError);
}

export function signSteps(season, teamId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/sign-steps';
    return getRequest(url)
        .then(r => {
            var steps = [];
            if (r.data && r.data.length > 0) {
                r.data.forEach(el => {
                    steps.push(mapFromStepApi(el));
                });
            } else {
                console.error("error getting response: signSteps = ", r)
            }
            return steps;
        })
        .catch(errors.handleError);
}

export function getStep(stepId, season) {
    var url = settings.API_URL + '/api';
    if (season) {
        url += '/seasons/' + season;
    }
    url += '/steps/' + stepId;
    return getRequest(url)
        .then(r => mapFromStepApi(r.data))
        .catch(errors.handleError);
}

export function createTeamStep(season, teamId, stepId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps';
    return putRequest(url, { stepId: stepId });
}

export function getTeamSteps(season, teamId) {
    if (!teamId || teamId === 'undefined') {
        debugger;
    }
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps';
    return getRequest(url)
        .then(r => {
            var steps = [];
            if (r.data && r.data.length > 0) {
                r.data.forEach(el => {
                    steps.push(mapFromStepApi(el));
                });
            } else {
                console.error("error getting response: getTeamSteps = ", r)
            }
            return steps;
        })
        .catch(errors.handleError);
}

export function getTeamsByStep(season, stepId) {
    const url = settings.API_URL + '/api/teams?season=' + season + '&stepId=' + stepId;
    return getRequest(url)
        .then(r => {
            var teams = [];
            if (r.data && r.data.length > 0) {
                r.data.forEach(el => {
                    teams.push(mapFromTeamApi(el));
                });
            } else {
                console.error("error getting response: getTeamsByStep = ", r)
            }
            return teams;
        })
        .catch(errors.handleError);
}

export function removeTeamStep(season, teamId, stepId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId;
    return deleteRequest(url);
}

export function getPlayers(season, teamId, stepId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players';
    return getRequest(url)
        .then(r => {
            var result = []
            if (r.data && r.data.length > 0) {
                r.data.forEach(el => {
                    result.push(mapPlayerFromApi(el));
                });
            } else {
                console.error("error getting response: getPlayers = ", r)
            }
            return result;
        })
        .catch(errors.handleError);
}

export function getStaff(season, teamId, stepId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/staff';
    return getRequest(url)
        .then(r => {
            var result = []
            if (r.data && r.data.length > 0) {
                r.data.forEach(el => {
                    result.push(mapPlayerFromApi(el));
                });
            }
            return result;
        })
        .catch(errors.handleError);
}

export function getPlayer(season, teamId, stepId, playerId) {
    const url = settings.API_URL + '/api/seasons/'+season+'/teams/'+teamId+'/steps/'+stepId+'/players/'+playerId;
    return getRequest(url)
        .then(r => mapPlayerFromApi(r.data))
        .catch(errors.handleError);
}

export function getPhoto(season, teamId, stepId, playerId) {
    const url = settings.API_URL + '/api/seasons/'+season+'/teams/'+teamId+'/steps/'+stepId+'/players/'+playerId+ '/photo';
    return getRequest(url)
        .then(r => mapPhotoFromApi(r.data))
        .catch(errors.handleError);
}

export function getDocument(season, teamId, stepId, playerId) {
    const url = settings.API_URL + '/api/seasons/'+season+'/teams/'+teamId+'/steps/'+stepId+'/players/'+playerId+ '/doc';
    return getRequest(url)
        .then(r => {
            if (r.data.ExistsLocally) {
                return mapDocumentFromApi(r.data.Src);
            } else {
                return null;
            }
        })
        .catch(errors.handleError);
}

export function getPerson(idCardNr, includeCaretaker) {
    const url = settings.API_URL + '/api/persons?idCardNr=' + idCardNr + (includeCaretaker ? '&caretaker=true' : '');
    return getRequest(url)
        .then(r => mapPersonFromApi(r.data))
        .catch(errors.handleError);
}

export function searchPersons(idCardNr){
    const url = settings.API_URL + '/api/persons?idCardNr=' + idCardNr + '&multiple=true';
    return getRequest(url);
}

export function createPlayer(season, teamId, stepId, player) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players';
    return putRequest(url, mapPlayerToApi(player));
}

export function updatePlayer(season, teamId, stepId, playerId, player) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + playerId;
    return patchRequest(url, mapPlayerToApi(player))
}

export function copyPlayers(season, teamId, stepId, fromSeason, playerIds) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/import-players';
    const data = {
        selectedSeason: fromSeason,
        playerIds: playerIds
    };
    return postRequest(url, data)
        .then(r => r.data)
        .catch(errors.handleError);
}

export function exportPlayers(season, teamId, stepId) {
    const url = settings.API_URL + '/api/admin/export?season=' + season + '&teamId=' + teamId + '&stepId=' + stepId;
    return getRequest(url);
}

export function getGameTemplate(season, homeTeamId, awayTeamId, stepId) {
    const url = settings.API_URL + '/api/admin/templates/game?season=' + season + ' &homeTeamId=' + homeTeamId + ' &awayTeamId=' + awayTeamId + '&stepId=' + stepId;
    return getRequest(url)
        .then(result => result.data)
        .catch(errors.handleError);
}

export function getTeamTemplate(season, teamId, stepId) {
    const url = settings.API_URL + '/api/admin/templates/team?season=' + season +' &teamId=' + teamId + '&stepId=' + stepId;
    return getRequest(url)
        .then(result => result.data)
        .catch(errors.handleError);
}

export function removePlayer(season, teamId, stepId, playerId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + playerId
    return deleteRequest(url)
        .catch(errors.handleError);
}

export function getUsers() {
    const url = settings.API_URL + '/api/admin/users';
    return getRequest(url)
        .then(r => {
            var result = []
            if (r.data && r.data.length > 0) {
                r.data.forEach(el => {
                    result.push(mapFromUserApi(el));
                });
            }
            return result;
        })
        .catch(errors.handleError);
}

export function createUser(username, password, teamId) {
    const url = settings.API_URL + '/api/admin/users';
    const data = {
        username: username,
        password: password,
        teamId: teamId
    };
    return putRequest(url, data)
        .catch((err) => {
            errors.handleError(err, { e409: 'Nome de utilizador já existe!'});
        });
}

export function login(username, password) {
    const url = settings.API_URL + '/api/authenticate';
    return postRequest(url, { username: username, password: password })
        .then(response => {
            //console.log(response);
            return response.data;
        })
        .catch(() => null);
}

export function logout(username) {
    return postRequest(settings.API_URL + '/api/logout', { user: username })
        .catch(errors.handleError);
}

export function getStatistics() {
    const url = settings.API_URL + '/api/admin/statistics';
    return getRequest(url)
        .then(res => res.data)
        .catch(err => console.error(err));
}

export function getDbPing() {
    const url = settings.API_URL + '/api/admin/ping';
    return getRequest(url);
}

export function addSeason(year, isActive, signUpDueDate, startDate) {
    const url = settings.API_URL + '/api/admin/seasons';
    const data = {
        year: year,
        isActive: isActive,
        signUpDueDate: signUpDueDate,
        startDate: startDate
    };
    return putRequest(url, data);
}

export function updateSeason(year, isActive, signUpDueDate, startDate, signUpExtraDueDate) {
    const url = settings.API_URL + '/api/admin/seasons/update';
    const data = {
        season: year,
        isActive: isActive,
        signUpDueDate: signUpDueDate,
        startDate: startDate,
        signUpExtraDueDate: signUpExtraDueDate
    };
    axios.put(url, data)
        .then(result => {
            console.log(result);
            alert('Época actualizada.');
        })
        .catch((err) => {
            errors.handleError(err);
        });
}

function getRequest(url) {
    return axios.get(url);
}

function postRequest(url, data) {
    return axios.post(url, data, options);
}

function putRequest(url, data) {
    return axios.put(url, data, options);
}

function patchRequest(url, data) {
    return axios.patch(url, data, options);
}

function deleteRequest(url) {
    return axios.delete(url);
}

