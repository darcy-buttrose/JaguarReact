import React from 'react';
import _ from 'lodash';
import namor from 'namor';
import ReactTableGrid from '../../components/ReactTableGrid';

const genFlagColour = (number) => {
  switch (number) {
    case 1: return 77;
    case 2: return 21;
    case 3: return 54;
    default: return 0;
  }
};

const genAttrColour = (number) => {
  switch (number) {
    case 1: return 'red';
    case 2: return 'green';
    case 3: return 'orange';
    default: return 'none';
  }
};

function ConfigPage() {
  const randomCameraList = _.range(1, 4000).map((id) => ({
    id,
    name: namor.generate({ words: 2, numbers: 3 }),
    trainedMinutes: Math.floor(Math.random() * 1440),
    flagsColour: genFlagColour(Math.floor(Math.random() * 4)),
    attr1: genAttrColour(Math.floor(Math.random() * 4)),
    attr2: genAttrColour(Math.floor(Math.random() * 4)),
    attr3: genAttrColour(Math.floor(Math.random() * 4)),
    attr4: genAttrColour(Math.floor(Math.random() * 4)),
    attr5: genAttrColour(Math.floor(Math.random() * 4)),
  }));

  return (
    <div>
      <ReactTableGrid cameraList={randomCameraList} />
    </div>
  );
}

export default ConfigPage;
