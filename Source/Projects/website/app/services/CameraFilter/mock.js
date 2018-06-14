import type ICameraFilter from './ICameraFilter';

export const mockData = [
  {
    id: 0,
    name: 'No Filter',
    cameraList: [],
  },
  {
    id: 1,
    name: 'milestone-pta',
    cameraList: [390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402],
  },
  {
    id: 2,
    name: 'Glitchy',
    cameraList: [363, 364, 365, 366, 367, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501],
  },
  {
    id: 3,
    name: 'milestone-swinburne',
    cameraList: [403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424],
  },
  {
    id: 4,
    name: 'milestone-all',
    cameraList: [344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501],
  },
];

const create = (baseURL, token) => {
  console.log(`CameraFilter Api Mock: baseUrl(${baseURL}) token(${token})`)
  const getCameraFilter = (): Promise<Array<ICameraFilter>> => new Promise((resolve: Function) => {
    resolve(mockData);
  });

  return {
    // a list of the API functions
    getCameraFilter,
  };
};

export default {
  create,
};
