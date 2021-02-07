import React from 'react';
import metamskLogo from '../../../assets/images/metamask-logo.png';

const InstallMetameask = () => {
  return (
    <div className="install-metameask">
      <div className="install-metameask__wrap">
        <div className="install-metameask__title">
          Please install metamask extension
        </div>
        <div className="install-metameask__metamask-logo">
          <img src={metamskLogo} alt="logo-metamask" />
        </div>
      </div>
    </div>
  );
};

export default InstallMetameask;