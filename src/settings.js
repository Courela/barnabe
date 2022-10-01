var settings = process.env.NODE_ENV !== 'production' ? 
    { 
      API_PROTOCOL: 'http', 
      API_HOST: 'localhost', 
      API_PORT: '8001', 
      API_URL: '',
      DEFAULT_TABLE_PAGE_SIZE: 20,
      PLAYER_REQUEST_TIMEOUT: 300000
    } :
    { 
      API_PROTOCOL: 'https', 
      API_HOST: process.env.APP_HOST, 
      API_PORT: '443', 
      API_URL: '',
      DEFAULT_TABLE_PAGE_SIZE: 20,
      PLAYER_REQUEST_TIMEOUT: 300000
    };

settings.API_URL = settings.API_PROTOCOL + '://' + settings.API_HOST + ':' + settings.API_PORT;
      
export default settings;
