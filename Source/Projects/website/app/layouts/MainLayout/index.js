import React from 'react';
import PropTypes from 'prop-types';
import AppHeader from 'components/AppHeader';
import StatusBar from 'components/StatusBar';

function MainLayout(props) {
  return (
    <div className='connect-main-layout'>
      <AppHeader />
      {props.children}
      <StatusBar />
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.object,
};

export default MainLayout;
