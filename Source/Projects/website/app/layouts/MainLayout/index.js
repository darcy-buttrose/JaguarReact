import React from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import SideBar from '../../components/SideBar';
import AppHeader from '../../containers/AppHeader';
import StatusBar from '../../components/StatusBar';

function MainLayout(props) {
  return (
    <div className="connect-main-layout">
      <AppHeader />
      <SideBar />
      <div className="jaguar-page">
        {props.children}
      </div>
      <StatusBar />
      <ToastContainer autoClose={8000} />
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.object,
};

export default MainLayout;
