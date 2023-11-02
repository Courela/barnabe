import axios from 'axios';
import moment from 'moment/moment';
import { clientSettings } from '../clientSettings';
import handleError from '../components/Errors';
import { 
    mapFromUserApi, 
    mapFromSeasonApi, 
    mapFromRoleApi, 
    mapFromStepApi,
    mapFromTeamStepApi, 
    mapFromTeamApi, 
    mapPersonFromApi, 
    mapPlayerFromApi,
    mapPlayerToApi,
    mapPhotoFromApi,
    mapDocFromApi,
    mapMatchFromApi,
    mapStandingFromApi,
    mapDocumentFromApi,
    mapDocToApi
} from './mappings';

//axios.defaults.validateStatus = (status) => status >= 200 && status < 300;

const options = {
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: clientSettings.PLAYER_REQUEST_TIMEOUT,
};

// var looseAxios = axios.create({
//     validateStatus: (status) => status < 500
// });

export function getSeasons() {
    const url = clientSettings.API_URL + '/api/seasons';
    return getRequest(url)
        .then(r => {
            var result = [];
            if (r.data) {
                if (r.data.length > 0) {
                    r.data.forEach(el => {
                        result.push(mapFromSeasonApi(el));
                    });
                } else {
                    console.info('No seasons found.');
                }
            } else {
                console.error("error getting response: getSeasons = ", r)
            }
            return result;
        })
        .catch(handleError);
}

export function getRoles() {
    const url = clientSettings.API_URL + '/api/roles';
    return getRequest(url)
        .then(r => {
            var steps = [];
            if (r.data) {
                if (r.data.length > 0) {
                    r.data.forEach(el => {
                        steps.push(mapFromRoleApi(el));
                    });
                } else {
                    console.info('No roles found.');
                }
            } else {
                console.error("error getting response: getRoles = ", r)
            }
            return steps;
        })
        .catch(handleError);
}

export function getSteps() {
    const url = clientSettings.API_URL + '/api/steps';
    return getRequest(url)
        .then(r => {
            var steps = [];
            if (r.data)  {
                if (r.data.length > 0) {
                    r.data.forEach(el => {
                        steps.push(mapFromStepApi(el));
                    });
                } else {
                    console.info('No steps found.');
                }
            } else {
                console.error("error getting response: getSteps = ", r)
            }
            return steps;
        })
        .catch(handleError);
}

export function getActiveSeason() {
    return getSeasons()
        .then(res => res.find(s => s.is_active))
        .catch(handleError);
}

export function getSeason(season) {
    const url = clientSettings.API_URL + '/api/seasons/' + season;
    return getRequest(url)
        .then(r => mapFromSeasonApi(r.data))
        .catch(handleError);
}

export function getTeams(season) {
    var url = clientSettings.API_URL + '/api/teams';
    if (season) {
        url += '?season=' + season;
    }
    return getRequest(url)
        .then(r => {
            var teams = [];
            if (r.data) {
                if (r.data.length > 0) {
                    r.data.forEach(el => {
                        teams.push(mapFromTeamApi(el));
                    });
                } else {
                    console.info('No teams found.');
                }
            } else {
                console.warn("Response: getTeams = ", r)
            }
            return teams;
        })
        .catch(handleError);
}

export function createTeam(name, shortDescription) {
    const url = clientSettings.API_URL + '/api/teams'
    const data = {
        name: name,
        shortDescription: shortDescription
    };
    return postRequest(url, data)
        .then(r => r.data)
        .catch(handleError);
}

export function getTeam(teamId) {
    const url = clientSettings.API_URL + '/api/teams/' + teamId;
    return getRequest(url)
        .then(r => mapFromTeamApi(r.data))
        .catch(handleError);
}

export function signSteps(season, teamId) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/sign-steps';
    return getRequest(url)
        .then(r => {
            var steps = [];
            if (r.data) {
                if (r.data.length > 0) {
                    r.data.forEach(el => {
                        steps.push(mapFromTeamStepApi(el));
                    });
                } else {
                    console.info('No steps found.');
                }
            } else {
                console.error("error getting response: signSteps = ", r)
            }
            return steps;
        })
        .catch(handleError);
}

export function getStep(stepId, season) {
    var url = clientSettings.API_URL + '/api';
    if (season) {
        url += '/seasons/' + season;
    }
    url += '/steps/' + stepId;
    return getRequest(url)
        .then(r => mapFromStepApi(r.data))
        .catch(handleError);
}

export function getTeamStep(teamStepId, teamId, season) {
    var url = clientSettings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + teamStepId;
    return getRequest(url)
        .then(r => mapFromTeamStepApi(r.data))
        .catch(handleError);
}

export function createTeamStep(season, teamId, stepId) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps';
    return putRequest(url, { stepId: stepId });
}

export function getTeamSteps(season, teamId) {
    if (!teamId || teamId === 'undefined') {
        console.error("No team to get steps from!");
    }
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps';
    return getRequest(url)
        .then(r => {
            var steps = [];
            if (r.data) {
                if (r.data.length > 0) {
                    r.data.forEach(el => {
                        steps.push(mapFromTeamStepApi(el));
                    });
                } else {
                    console.info('No steps found.');
                }
            } else {
                console.warn("Response: getTeamSteps = ", r)
            }
            return steps;
        })
        .catch(handleError);
}

export function getTeamsByStep(season, stepId) {
    const url = clientSettings.API_URL + '/api/teams?season=' + season + '&stepId=' + stepId;
    return getRequest(url)
        .then(r => {
            var teams = [];
            if (r.data) {
                if (r.data.length > 0) {
                    r.data.forEach(el => {
                        teams.push(mapFromTeamApi(el));
                    });
                } else {
                    console.info('No teams found.');
                }
            } else {
                console.warn("Response: getTeamsByStep = ", r)
            }
            return teams;
        })
        .catch(handleError);
}

export function removeTeamStep(season, teamId, stepId) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId;
    return deleteRequest(url);
}

export function getPlayers(season, teamId, stepId) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players';
    return getRequest(url)
        .then(r => {
            var result = []
            if (r.data) { 
                if (r.data.length > 0) {
                    r.data.forEach(el => {
                        result.push(mapPlayerFromApi(el));
                    });
                } else {
                    console.info('No players found.');
                }
            } else {
                console.error("error getting response: getPlayers = ", r)
            }
            return result;
        })
        .catch(handleError);
}

export function getStaff(season, teamId, stepId) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/staff';
    return getRequest(url)
        .then(r => {
            var result = []
            if (r.data) {
                if (r.data.length > 0) {
                    r.data.forEach(el => {
                        result.push(mapPlayerFromApi(el));
                    });
                } else {
                    console.info('No staff found.');
                }
            } else {
                console.error("error getting response: getStaff = ", r)
            }
            return result;
        })
        .catch(handleError);
}

export function getPlayer(season, teamId, stepId, playerId) {
    const url = clientSettings.API_URL + '/api/seasons/'+season+'/teams/'+teamId+'/steps/'+stepId+'/players/'+playerId;
    return getRequest(url)
        .then(r => mapPlayerFromApi(r.data))
        .catch(handleError);
}

export function getPhoto(season, teamId, stepId, playerId) {
    const url = clientSettings.API_URL + '/api/seasons/'+season+'/teams/'+teamId+'/steps/'+stepId+'/players/'+playerId+ '/photo';
    return getRequest(url)
        .then(r => mapPhotoFromApi(r.data))
        .catch(handleError);
}

export function getDocument(season, teamId, stepId, playerId) {
    const url = clientSettings.API_URL + '/api/seasons/'+season+'/teams/'+teamId+'/steps/'+stepId+'/players/'+playerId+ '/doc';
    return getRequest(url)
        .then(r => {
            if (r.data) {
                return mapDocFromApi(r.data);
            } else {
                return null;
            }
        })
        .catch(handleError);
}

export function getPerson(idCardNr, includeCaretaker) {
    const url = clientSettings.API_URL + '/api/persons?idCardNr=' + idCardNr + (includeCaretaker ? '&caretaker=true' : '');
    return getRequest(url)
        .then(r => mapPersonFromApi(r.data))
        .catch(handleError);
}

export function searchPersons(idCardNr){
    const url = clientSettings.API_URL + '/api/persons?idCardNr=' + idCardNr + '&multiple=true';
    return getRequest(url);
}

export function createPlayer(season, teamId, stepId, player) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players';
    return putRequest(url, mapPlayerToApi(player));
}

export function updatePlayer(season, teamId, stepId, playerId, player) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + playerId;
    return patchRequest(url, mapPlayerToApi(player))
}

export function copyPlayers(season, teamId, stepId, fromSeason, playerIds) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/import-players';
    const data = {
        selectedSeason: fromSeason,
        playerIds: playerIds
    };
    return postRequest(url, data)
        .then(r => r.data)
        .catch(handleError);
}

export function exportPlayers(season, teamId, stepId) {
    const url = clientSettings.API_URL + '/api/admin/export?season=' + season + '&teamId=' + teamId + '&stepId=' + stepId;
    return getRequest(url);
}

export function getGameTemplate(season, homeTeamId, awayTeamId, stepId) {
    const url = clientSettings.API_URL + '/api/admin/templates/game?season=' + season + ' &homeTeamId=' + homeTeamId + ' &awayTeamId=' + awayTeamId + '&stepId=' + stepId;
    return getRequest(url)
        .then(result => result.data)
        .catch(handleError);
}

export function getTeamTemplate(season, teamId, stepId) {
    const url = clientSettings.API_URL + '/api/admin/templates/team?season=' + season +'&teamId=' + teamId + '&stepId=' + stepId;
    return getRequest(url)
        .then(result => result.data)
        .catch(handleError);
}

export function removePlayer(season, teamId, stepId, playerId) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + playerId
    return deleteRequest(url)
        .catch(handleError);
}

export function getUsers() {
    const url = clientSettings.API_URL + '/api/admin/users';
    return getRequest(url)
        .then(r => {
            var result = []
            if (r.data) {
                if (r.data.length > 0) {
                    r.data.forEach(el => {
                        result.push(mapFromUserApi(el));
                    });
                } else {
                    console.info('No users found.');
                }
            }
            return result;
        })
        .catch(handleError);
}

export function createUser(username, password, teamId, email) {
    const url = clientSettings.API_URL + '/api/admin/users';
    const data = {
        username: username,
        password: password,
        teamId: teamId,
        email: email
    };
    return putRequest(url, data)
        .catch((err) => {
            handleError(err, { e409: 'Nome de utilizador já existe!'});
        });
}

export function login(username, password) {
    const url = clientSettings.API_URL + '/api/authenticate';
    return postRequest(url, { username: username, password: password })
        .then(response => {
            return response.data;
        })
        .catch(() => null);
}

export function logout(username) {
    return postRequest(clientSettings.API_URL + '/api/logout', { user: username })
        .catch(handleError);
}

export function getStatistics() {
    const url = clientSettings.API_URL + '/api/admin/statistics';
    return getRequest(url)
        .then(res => res.data)
        .catch(err => console.error(err));
}

export function getDbPing() {
    const url = clientSettings.API_URL + '/api/admin/ping';
    return getRequest(url);
}

export function addSeason(year, isActive, signUpDueDate, startDate) {
    const url = clientSettings.API_URL + '/api/admin/seasons/add';
    const data = {
        year: year,
        isActive: isActive,
        signUpDueDate: signUpDueDate,
        startDate: startDate
    };
    return postRequest(url, data);
}

export function updateSeason(year, isActive, signUpDueDate, startDate, signUpExtraDueDate) {
    const url = clientSettings.API_URL + '/api/admin/seasons/update';
    const data = {
        season: year,
        isActive: isActive,
        signUpDueDate: removeDateLocale(signUpDueDate),
        startDate: removeDateLocale(startDate),
        signUpExtraDueDate: removeDateLocale(signUpExtraDueDate)
    };
    return putRequest(url, data);
}

export async function getPhases() {
    const url = clientSettings.API_URL + '/api/phases';
    try {
        const res = await getRequest(url);
        return res.data.map(p => { return { id: p.Id, description: p.Name }; });
    } catch (err) {
        handleError(err);
        return [];
    }
}

export async function getStandings(season, stepId, phaseId) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/steps/' + stepId + '/standings/' + phaseId;
    try {
        const standings = await getRequest(url);
        var result = []
        if (standings.data && standings.data.length > 0) {
            standings.data.forEach(el => {
                result.push(mapStandingFromApi(el));
            });
        }
        return result;
    } catch (err) {
        return console.error(err);
    }
}

export async function getMatches(season, stepId, phaseId) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/steps/' + stepId + '/matches/' + phaseId;
    try {
        const r = await getRequest(url);
        var result = []
        if (r.data && r.data.length > 0) {
            r.data.forEach(el => {
                result.push(mapMatchFromApi(el));
            });
        }
        return result;
    } catch (err) {
        console.error(err);
        handleError(err);
    }
}

export async function addMatch(season, stepId, date, phase, group, matchday, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/steps/' + stepId + '/add-match';
    const data = {
        date: date,
        phase: phase,
        group: group,
        matchday: matchday,
        homeTeamId: homeTeamId,
        homeTeamGoals: homeTeamGoals,
        awayTeamId: awayTeamId,
        awayTeamGoals: awayTeamGoals,
    };
    const res = await postRequest(url, data);
    return res.data;
}

export async function removeMatch(season, stepId, matchId) {
    const url = clientSettings.API_URL + '/api/seasons/' + season + '/steps/' + stepId + '/matches/' + matchId
    return deleteRequest(url)
        .catch(handleError);
}

export async function recoverPassword(email) {
    const url = clientSettings.API_URL + '/api/recoverPassword';
    try {
        const data = {
            email: email,
        };
        const res = await postRequest(url, data);
        return res.data;
    } catch (err) {
        return console.error(err);
    }
}

export async function saveUserDetails(username, password, email) {
    const url = clientSettings.API_URL + '/api/user/' + username ;
    try {
        const data = {
            password: password,
            email: email
        };
        const res = await postRequest(url, data);
        return res.data;
    } catch (err) {
        console.error(err);
        handleError(err);
    }
}

export async function getDocuments() {
    const url = clientSettings.API_URL + '/api/documents';
    try {
        const res = await getRequest(url);
        return res.data ? res.data.map(d => mapDocumentFromApi(d)) : [];
    } catch (err) {
        console.error(err);
        handleError(err);
    }
}

export async function loadDocument(name, type, link) {
    const url = clientSettings.API_URL + '/api/admin/documents';
    try {
        const data = mapDocToApi({
            name: name,
            type: type,
            link: link
        });
        const res = await postRequest(url, data);
        return res.data;
    } catch (err) {
        console.error(err);
        handleError(err);
    }
}

function removeDateLocale(date) {
    return moment(date).utcOffset(0, true);
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

