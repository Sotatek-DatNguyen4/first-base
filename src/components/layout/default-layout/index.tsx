import React from 'react';
import Left from './left';
import Right from './right';
import './style.scss';

const DefaultLayout = (props: any) => {
  return (
    <div className="default-layout">
      <Left />
      <Right>{props.children}</Right>
    </div>
  );
};

export default DefaultLayout;