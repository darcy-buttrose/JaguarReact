import React from 'react';
import PropTypes from 'prop-types';

import ProfileHeader from 'components/ProfileHeader';
import Footer from 'components/Footer';

function ProfileLayout(props) {
  return (
    <div>
      <ProfileHeader />
      {props.children}
      <Footer />
    </div>
  );
}

ProfileLayout.propTypes = {
  children: PropTypes.object,
};

export default ProfileLayout;
