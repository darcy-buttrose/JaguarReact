import React from 'react';
import PropTypes from 'prop-types';
import CandidatePackage from './CandidatePackage';
import MemberPackage from './MemberPackage';
import ISSPackage from './ISSPackage';

function TeacherSolutions(props) {
  return (
    <div className="container">
      <div className="row">
        <div className="four columns">
          <CandidatePackage onSelectPackage={props.onSelect} />
        </div>
        <div className="four columns">
          <MemberPackage onSelectPackage={props.onSelect} />
        </div>
        <div className="four columns">
          <ISSPackage onSelectPackage={props.onSelect} />
        </div>
      </div>
    </div>
  );
}

TeacherSolutions.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default TeacherSolutions;
