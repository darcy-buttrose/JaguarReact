import React from 'react';
import PropTypes from 'prop-types';

function MainLayout(props) {
  return (
    <div>
      {props.children}
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.object,
};

export default MainLayout;
