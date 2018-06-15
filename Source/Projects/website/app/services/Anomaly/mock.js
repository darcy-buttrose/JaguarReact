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

const create = (baseURL, user) => {
  console.log(`Anomaly API create: baseURL(${baseURL}) user(${JSON.stringify(user)})`);
  return {
    getWebSocketUrls: () => new Promise((resolve: Function): void => {
      resolve(mockData);
    }),
  };
};

export default {
  create,
};
