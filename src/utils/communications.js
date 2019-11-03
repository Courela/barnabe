import axios from 'axios';
import settings from '../settings';

const headers = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export function getSeasons() {
    const url = settings.API_URL + '/api/seasons';
    return getRequest(url);
}

export function getRoles() {
    const url = settings.API_URL + '/api/roles';
    return getRequest(url);
}

export function getSteps() {
    const url = settings.API_URL + '/api/steps';
    return getRequest(url);
}

export function getActiveSeason() {
    return getSeasons()
        .then(res => res.data.find(s => s.IsActive));
}

export function getSeason(season) {
    const url = settings.API_URL + '/api/seasons/' + season;
    return getRequest(url);
}

export function getTeams(season) {
    var url = settings.API_URL + '/api/teams';
    if (season) {
        url += '?season=' + season;
    }
    return getRequest(url);
}

export function getTeam(teamId) {
    const url = settings.API_URL + '/api/teams/' + teamId;
    return getRequest(url);
}

export function signSteps(season, teamId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/sign-steps';
    return getRequest(url);
}

export function getStep(stepId, season) {
    var url = settings.API_URL + '/api';
    if (season) {
        url += '/seasons/' + season;
    }
    url += '/steps/' + stepId;
    return getRequest(url);
}

export function createTeamStep(season, teamId, stepId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps';
    return putRequest(url, { stepId: stepId });
}

export function getTeamSteps(season, teamId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps';
    return getRequest(url);
}

export function getTeamsByStep(season, stepId) {
    const url = settings.API_URL + '/api/teams?season=' + season + '&stepId=' + stepId;
    return getRequest(url);
}

export function removeTeamStep(season, teamId, stepId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId;
    return deleteRequest(url);
}

export function getPlayers(season, teamId, stepId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players';
    return getRequest(url);
}

export function getStaff(season, teamId, stepId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/staff';
    return getRequest(url);
}

export function getPlayer(season, teamId, stepId, playerId) {
    const url = settings.API_URL + '/api/seasons/'+season+'/teams/'+teamId+'/steps/'+stepId+'/players/'+playerId;
    return getRequest(url);
}

export function getPhoto(season, teamId, stepId, playerId) {
    const url = settings.API_URL + '/api/seasons/'+season+'/teams/'+teamId+'/steps/'+stepId+'/players/'+playerId+ '/photo';
    return getRequest(url);
}

export function getPerson(docId, includeCaretaker) {
    const url = settings.API_URL + '/api/persons?docId=' + docId + (includeCaretaker ? '&caretaker=true' : '');
    return getRequest(url);
}

export function searchPersons(docId){
    const url = settings.API_URL + '/api/persons?docId=' + docId + '&multiple=true';
    return getRequest(url);
}

export function createPlayer(season, teamId, stepId, data) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players';
    return putRequest(url, data);
}

export function updatePlayer(season, teamId, stepId, playerId, data) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + playerId;
    return patchRequest(url, data)
}

export function copyPlayers(season, teamId, stepId, fromSeason, playerIds) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/import-players';
    const data = {
        selectedSeason: fromSeason,
        playerIds: playerIds
    }
    return postRequest(url, data);
}

export function exportPlayers(season, teamId, stepId) {
    const url = settings.API_URL + '/api/admin/export?season=' + season + '&teamId=' + teamId + '&stepId=' + stepId;
    return getRequest(url);
}

export function getGameTemplate(season, homeTeamId, awayTeamId, stepId) {
    const url = settings.API_URL + '/api/admin/templates/game?season=' + season + ' &homeTeamId=' + homeTeamId + ' &awayTeamId=' + awayTeamId + '&stepId=' + stepId;
    return getRequest(url);
}

export function getTeamTemplate(season, teamId, stepId) {
    const url = settings.API_URL + '/api/admin/templates/team?season=' + season +' &teamId=' + teamId + '&stepId=' + stepId;
    return getRequest(url);
}

export function removePlayer(season, teamId, stepId, playerId) {
    const url = settings.API_URL + '/api/seasons/' + season + '/teams/' + teamId + '/steps/' + stepId + '/players/' + playerId
    return deleteRequest(url);
}

export function getUsers() {
    const url = settings.API_URL + '/api/admin/users';
    return getRequest(url);
}

export function createUser(username, password, teamId) {
    const url = settings.API_URL + '/api/admin/users';
    const data = {
        username: username,
        password: password,
        teamId: teamId
    };
    return putRequest(url, data);
}

export function login(username, password) {
    const url = settings.API_URL + '/api/authenticate';
    return postRequest(url, { username: username, password: password });
}

export function logout() {
    return postRequest(settings.API_URL + '/api/logout');
}

export function getStatistics() {
    const url = settings.API_URL + '/api/admin/statistics';
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
