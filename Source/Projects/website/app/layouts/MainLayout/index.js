import React from 'react';
import PropTypes from 'prop-types';
import SideBar from 'components/SideBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import AppHeader from '../../containers/AppHeader';
import StatusBar from '../../components/StatusBar';

function MainLayout(props) {
  return (
    <div className="connect-main-layout">
      <AppHeader />
      <SideBar />
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
