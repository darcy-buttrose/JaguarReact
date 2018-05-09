import React from 'react';
import frameChannels from 'frame-channels';
import { Form, ValidatedInput, ButtonInput } from '../../containers/ValidatedForm';

class LiveWallInnerPage extends React.PureComponent {
  constructor() {
    super();
    this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
    this.channel = frameChannels.create('my-channel', { target: window.parent });
    this.channel.subscribe((msg) => {
      console.log('Inner Got', msg);
    });
  }

  handleValidSubmit(values) {
    this.channel.push({
      hello: 'parent',
      token: values.token,
    });
  }

  handleInvalidSubmit(errors, values) {
    console.log(`${JSON.stringify(errors)} - ${JSON.stringify(values)}`);
  }

  render() {
    return (
      <div>
        <Form
          onValidSubmit={this.handleValidSubmit}
          onInvalidSubmit={this.handleInvalidSubmit}
        >
          <ValidatedInput
            type="text"
            placeholder="Token"
            label="Token"
            name="token"
            validate="required"
            defaultValue=""
            errorHelp={{
              required: 'Please enter token',
            }}
          />
          <ButtonInput
            type="submit"
            bsSize="large"
            bsStyle="primary"
            value={'Send'}
            block
          />
        </Form>
      </div>
    );
  }
}

export default LiveWallInnerPage;

