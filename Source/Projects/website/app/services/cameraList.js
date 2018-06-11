const cameraList = [
  {
    id: 0,
    name: 'HIK-Entry-D3003-1-court',
    trainedMinutes: 2880,
    flagsColour: 0,
    attr1: 'red',
    attr2: 'none',
    attr3: 'none',
    attr4: 'none',
    attr5: 'none',
  },
  {
    id: 0,
    name: 'HIK-Entry-D3034-2-ship',
    trainedMinutes: 1440,
    flagsColour: 0,
    attr1: 'none',
    attr2: 'none',
    attr3: 'none',
    attr4: 'red',
    attr5: 'none',
  },
  {
    id: 0,
    name: 'HIK-D4780-1-Entry',
    trainedMinutes: 4320,
    flagsColour: 0,
    attr1: 'none',
    attr2: 'none',
    attr3: 'none',
    attr4: 'none',
    attr5: 'orange',
  },
];

// Create a base for API.
const create = () => {
  const getCameraList = () => new Promise((resolve: Function): void => {
    resolve(cameraList);
  });

  return {
    // a list of the API functions
    getCameraList,
  };
};

export default {
  create,
};
