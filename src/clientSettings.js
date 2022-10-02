var clientSettings = process.env.NODE_ENV !== 'production' ? 
    { 
      API_PROTOCOL: 'http', 
      API_HOST: process.env.REACT_APP_APP_HOST, 
      API_PORT: '8001', 
      API_URL: '',
      DEFAULT_TABLE_PAGE_SIZE: 20,
      PLAYER_REQUEST_TIMEOUT: 300000
    } :
    { 
      API_PROTOCOL: 'https', 
      API_HOST: process.env.REACT_APP_APP_HOST, 
      API_PORT: '443', 
      API_URL: '',
      DEFAULT_TABLE_PAGE_SIZE: 20,
      PLAYER_REQUEST_TIMEOUT: 300000
    };

clientSettings.API_URL = clientSettings.API_PROTOCOL + '://' + clientSettings.API_HOST + ':' + clientSettings.API_PORT;

export { 
  clientSettings
};
