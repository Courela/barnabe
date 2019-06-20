import axios from 'axios';
import settings from '../settings';

const headers = {
    headers: {
        'Content-Type': 'application/json'
    }
};

function getSeasons() {
    const url = settings.API_URL + '/api/seasons';
    return getRequest(url);
}

function getRoles() {
    const url = settings.API_URL + '/api/roles';
    return getRequest(url);
}

function getSteps() {
    const url = settings.API_URL + '/api/steps';
    return getRequest(url);
}

function getSeason(season) {
    const url = settings.API_URL + '/api/seasons/' + season;
    return getRequest(url);
}

function getTeams(season) {
    var url = settings.API_URL + '/api/teams';
    if (season) {
        url += '?season=' + season;
    }
    return getRequest(url);
}

function getTeam(teamId) {
    const url = settings.API_URL + '/api/teams/' + teamId;
    return getRequest(url);
}

function signSteps(season, teamId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/signsteps';
    return getRequest(url);
}

function getStep(stepId, season) {
    var url = settings.API_URL + '/api';
    if (season) {
        url += '/seasons/' + season;
    }
    url += '/steps/' + stepId;
    return getRequest(url);
}

function createTeamStep(season, teamId, stepId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps';
    return putRequest(url, { stepId: stepId });
}

function getTeamSteps(season, teamId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps';
    return getRequest(url);
}

function removeTeamStep(season, teamId, stepId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId;
    return deleteRequest(url);
}

function getPlayers(season, teamId, stepId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players';
    return getRequest(url);
}

function getStaff(season, teamId, stepId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/staff';
    return getRequest(url);
}

function getPlayer(season, teamId, stepId, playerId) {
    const url = settings.API_URL + '/api/seasons/'+season+'/teams/'+teamId+'/steps/'+stepId+'/players/'+playerId;
    return getRequest(url);
}

function getPhoto(season, teamId, stepId, playerId) {
    const url = settings.API_URL + '/api/seasons/'+season+'/teams/'+teamId+'/steps/'+stepId+'/players/'+playerId+ '/photo';
    return getRequest(url);
}

function getPerson(docId) {
    const url = settings.API_URL + '/api/persons?docId=' + docId;
    return getRequest(url);
}

function searchPersons(docId){
    const url = settings.API_URL + '/api/persons?docId=' + docId + '&multiple=true';
    return getRequest(url);
}

function createPlayer(season, teamId, stepId, data) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players';
    return putRequest(url, data);
}

function updatePlayer(season, teamId, stepId, playerId, data) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + playerId;
    return patchRequest(url, data)
}

function copyPlayers(season, teamId, stepId, fromSeason, playerIds) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/import-players';
    const data = {
        selectedSeason: fromSeason,
        playerIds: playerIds
    }
    return postRequest(url, data);
}

function exportPlayers(season, teamId, stepId) {
    const url = settings.API_URL + '/api/admin/export?season=' + season + '&teamId=' + teamId + '&stepId=' + stepId;
    return getRequest(url);
}

function getGameTemplate(season, homeTeamId, awayTeamId, stepId) {
    const url = settings.API_URL + '/api/admin/templates/game?season=' + season + ' &homeTeamId=' + homeTeamId + ' &awayTeamId=' + awayTeamId + '&stepId=' + stepId;
    return getRequest(url);
}

function getTeamTemplate(season, teamId, stepId) {
    const url = settings.API_URL + '/api/admin/templates/team?season=' + season +' &teamId=' + teamId + '&stepId=' + stepId;
    return getRequest(url);
}

function removePlayer(season, teamId, stepId, playerId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + playerId
    return deleteRequest(url);
}

function createUser(username, password, teamId) {
    const url = settings.API_URL + '/api/admin/users';
    const data = {
        username: username,
        password: password,
        teamId: teamId
    };
    return putRequest(url, data);
}

function login(username, password) {
    const url = settings.API_URL + '/api/authenticate';
    return postRequest(url, { username: username, password: password });
}

function logout() {
    return postRequest(settings.API_URL + '/api/logout');
}

function getStatistics() {
    const url = settings.API_URL + '/api/admin/statistics';
    return getRequest(url);
}

function getRequest(url) {
    return axios.get(url);
}

function postRequest(url, data) {
    return axios.post(url, data, headers);
}

function putRequest(url, data) {
    return axios.put(url, data, headers);
}

function patchRequest(url, data) {
    return axios.patch(url, data, headers);
}

function deleteRequest(url) {
    return axios.delete(url);
}

export {
    getSeasons,
    getRoles,
    getSteps,
    getSeason,
    getTeam,
    signSteps,
    getStep,
    getTeams,
    createTeamStep,
    getTeamSteps,
    removeTeamStep,
    getPlayers,
    getStaff,
    getPlayer,
    getPhoto,
    getPerson,
    searchPersons,
    createPlayer,
    updatePlayer,
    copyPlayers,
    exportPlayers,
    getGameTemplate,
    getTeamTemplate,
    removePlayer,
    createUser,
    login,
    logout,
    getStatistics
}