import { Router } from 'express';

let cameraFilter = [
    {
        "id": 0,
        "name": "All Cameras"
    },
    {
        "id": 5,
        "name": "Glitchy"
    },
    {
        "id": 4,
        "name": "internal"
    },
    {
        "id": 1,
        "name": "milestone-all"
    },
    {
        "id": 2,
        "name": "milestone-pta"
    },
    {
        "id": 3,
        "name": "milestone-swinburne"
    }
];


export default () => {
  const filterRouter = Router();

  filterRouter.get('/', (req, res) => {
    console.log('filterRouter', cameraFilter, req);
    res.send(cameraFilter);
  });

  return filterRouter;
};
