const settings = process.env.NODE_ENV !== 'production' ? 
    { API_PROTOCOL: 'http', API_HOST: 'localhost', API_PORT: '8000' } :
    { API_PROTOCOL: 'https', API_HOST: 'tacabarnabe.herokuapp.com', API_PORT: '443' };

settings.API_URL = settings.API_PROTOCOL + '://' + settings.API_HOST + ':' + settings.API_PORT + '';
settings.DEFAULT_TABLE_PAGE_SIZE = 20;

export default settings;
