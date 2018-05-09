import React from 'react';
import { FormGroup, Button } from 'react-bootstrap';

export default class ButtonInput extends React.Component {
  static propTypes = {
    bsSize: React.PropTypes.string,
    value: React.PropTypes.string.required
  };

  render () {
    let {bsSize, value, ...otherProps} = this.props;

    return (
      <FormGroup bsSize={bsSize}>
        <Button bsSize={bsSize} {...otherProps}>{value}</Button>
      </FormGroup>
    );
  }
}
