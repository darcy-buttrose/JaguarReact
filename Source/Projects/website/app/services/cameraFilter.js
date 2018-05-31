const cameraFilter = [
  {
    id: 0,
    name: 'All Cameras',
  },
  {
    id: 5,
    name: 'Glitchy',
  },
  {
    id: 4,
    name: 'internal',
  },
  {
    id: 1,
    name: 'milestone-all',
  },
  {
    id: 2,
    name: 'milestone-pta',
  },
  {
    id: 3,
    name: 'milestone-swinburne',
  },
];

// Create a base for API.
const create = () => {
  const getCameraFilter = () => new Promise((resolve: Function): void => {
    resolve(cameraFilter);
  });


  return {
    // a list of the API functions
    getCameraFilter,
  };
};

export default {
  create,
};
