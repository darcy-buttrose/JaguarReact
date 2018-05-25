import React from 'react';
import PropTypes from 'prop-types';
import {ToastContainer} from 'react-toastify';

import Header from '../../components/Header';
import StatusBar from '../../components/StatusBar';

function PublicLayout(props) {
  return (
    <div className="connect-public-layout">
      <Header />
      {props.children}
      <StatusBar />
      <ToastContainer autoClose={8000} />
    </div>
  );
}

PublicLayout.propTypes = {
  children: PropTypes.object,
};

export default PublicLayout;
