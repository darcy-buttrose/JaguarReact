export const mockData = [
  {
    url: 'wss://trillian/websocket/events/',
    streamBase: '/portal/streaming/soap_stream/',
  },
  {
    url: 'wss://regression1/websocket/events/',
    streamBase: '/portal/streaming/soap_stream/',
  },
  {
    url: 'wss://trillian/websocket/events/',
    streamBase: '/portal/streaming/soap_stream/',
  },
  {
    url: 'wss://regression1/websocket/events/',
    streamBase: '/portal/streaming/soap_stream/',
  },
  {
    url: 'wss://trillian/websocket/events/',
    streamBase: '/portal/streaming/soap_stream/',
  },
];

const create = (baseUrl, token) => {
  console.log(`Anomaly Api Mock: baseUrl(${baseUrl}) token(${token})`);
  return {
    getWebSocketUrls: () => new Promise((resolve: Function): void => {
      resolve(mockData);
    }),
  };
};

export default {
  create,
};
