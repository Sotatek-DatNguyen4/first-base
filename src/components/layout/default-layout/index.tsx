import React from 'react';
import LeftDefaultLayout from '../left-default-layout';
import RightDefaultLayout from '../right-default-layout';

const DefaultLayout = (props: any) => {

  return (
    <div className="default-layout">
      <LeftDefaultLayout />
      <RightDefaultLayout>{props.children}</RightDefaultLayout>
    </div>
  );
};

export default DefaultLayout;