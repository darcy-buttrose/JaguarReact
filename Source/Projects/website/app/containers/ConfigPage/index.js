import React from 'react';
import ReactTableGrid from '../../components/ReactTableGrid';

class ConfigPage extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      cameraList: [
        {
          id: 1,
          name: 'HIK-Entry-D3003-1-court',
          trainedMinutes: 2880,
          flagsColour: 77,
          attr1: 'red',
          attr2: 'none',
          attr3: 'none',
          attr4: 'none',
          attr5: 'none',
        },
        {
          id: 2,
          name: 'HIK-Entry-D3034-2-ship',
          trainedMinutes: 1560,
          flagsColour: 54,
          attr1: 'none',
          attr2: 'none',
          attr3: 'none',
          attr4: 'red',
          attr5: 'none',
        },
        {
          id: 3,
          name: 'HIK-D4780-1-Entry',
          trainedMinutes: 4320,
          flagsColour: 21,
          attr1: 'none',
          attr2: 'none',
          attr3: 'none',
          attr4: 'none',
          attr5: 'orange',
        },
      ],
    };
  }

  render() {
    return (
      <div>
        <ReactTableGrid cameraList={this.state.cameraList} />
      </div>
    );
  }
}

export default ConfigPage;
