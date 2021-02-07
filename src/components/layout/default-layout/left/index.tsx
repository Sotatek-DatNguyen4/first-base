import React from 'react';
import HeaderUser from './header-user';
import MainNav from './main-nav';
import Copyright from './copyright';

const Left = (props: any) => {
  return (
    <div className="default-layout__left">
      <HeaderUser />
      <MainNav />
      <Copyright />
    </div>
  );
};

export default Left;