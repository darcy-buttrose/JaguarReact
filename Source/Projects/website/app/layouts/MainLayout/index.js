import React from 'react';
import PropTypes from 'prop-types';
import AppHeader from 'components/AppHeader';
import StatusBar from 'components/StatusBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function MainLayout(props) {
  return (
    <div className="connect-main-layout">
      <AppHeader />
      {props.children}
      <StatusBar />
      <ToastContainer autoClose={8000} />
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.object,
};

export default MainLayout;
