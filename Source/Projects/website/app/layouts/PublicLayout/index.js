import React from 'react';
import PropTypes from 'prop-types';

import Header from 'components/Header';
import Footer from 'components/Footer';

function PublicLayout(props) {
  return (
    <div className="connect-layout">
      <Header />
      {props.children}
      <Footer />
    </div>
  );
}

PublicLayout.propTypes = {
  children: PropTypes.object,
};

export default PublicLayout;
