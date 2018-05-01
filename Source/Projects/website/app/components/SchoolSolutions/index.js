import React from 'react';
import PropTypes from 'prop-types';
import Cms from './Cms';
import ISS from './ISS';
import Promotions from './Promotions';


function SchoolSolutions(props) {
  return (
    <div className="container">
      <div className="row">
        <div className="four columns">
          <Cms onSelectPackage={props.onSelect} />
        </div>
        <div className="four columns">
          <Promotions onSelectPackage={props.onSelect} />
        </div>
        <div className="four columns">
          <ISS onSelectPackage={props.onSelect} />
        </div>
      </div>
    </div>
  );
}

SchoolSolutions.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default SchoolSolutions;
