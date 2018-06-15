import apisauce from 'apisauce';

/*
 * apisauce is supported by reactotron.
 */

// Create a base for API.
const create = (baseURL, user) => {
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // 10 second timeout...
    timeout: 10000,
  });

  const getHeaders = () => {
    const headers = {
//      'Cache-Control': 'no-cache',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `iCetana ${user.session_key}`,
    };
    return headers;
  };

  const getWebSocketUrls = () => new Promise((resolve: Function, reject: Function): void => {
    const getUrl = `installations/list/?session_key=${user.session_key}`;
    api.get(getUrl, {}, { headers: getHeaders() })
      .then((response) => {
        if (response.status === 200) {
          let urls = response.data || [];
          urls = urls.map((urlItem) => ({
            url: `wss://${urlItem.host}/websocket/events/`,
            streamBase: '/portal/streaming/soap_stream/',
          }));
          resolve(urls);
        } else {
          reject('get WebSocketUrls failed');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

  return {
    // a list of the API functions
    getWebSocketUrls,
  };
};

export default {
  create,
};
