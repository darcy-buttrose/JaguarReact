import React from 'react';
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';

export default class ValidatedInput extends React.Component {
  constructor (props) {
    super(props);

    const {validationEvent, validate, errorHelp, _registerInput, _unregisterInput, ...inputProps} = props;
    this.validationEvent = validationEvent;
    this.validate = validate;
    this.errorHelp = errorHelp;
    this._registerInput = _registerInput;
    this._unregisterInput = _unregisterInput;
    this.inputProps = inputProps;
    if (!this._registerInput || !this._unregisterInput) {
      throw new Error('Input must be placed inside the Form component');
    }
  }

  componentWillMount () {
    this._registerInput(this);
  }

  componentWillUnmount () {
    this._unregisterInput(this);
  }

  render () {
    const { bsStyle } = this.props;
    return (
      <FormGroup controlId={this.props.name} validationState={this.props.bsStyle}>
        <ControlLabel>{this.props.label}</ControlLabel>
        <FormControl ref="control" {...this.inputProps}>{this.props.children}</FormControl>
        <FormControl.Feedback />
        <div className={bsStyle}>{this.props.help}</div>
      </FormGroup>
    );
  }
}

ValidatedInput.propTypes = {
  bsStyle: React.PropTypes.string,
  label: React.PropTypes.string,
  type: React.PropTypes.string,
  componentClass: React.PropTypes.string,
  help: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  validationEvent: React.PropTypes.oneOf([
    '', 'onChange', 'onBlur', 'onFocus'
  ]),
  validate: React.PropTypes.oneOfType([
    React.PropTypes.func,
    React.PropTypes.string
  ]),
  errorHelp: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  _registerInput: React.PropTypes.func,
  _unregisterInput: React.PropTypes.func,
  children: React.PropTypes.any
};

ValidatedInput.defaultProps = {
  validationEvent: ''
};
