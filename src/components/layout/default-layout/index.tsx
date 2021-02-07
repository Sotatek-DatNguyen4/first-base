import React from 'react';
import LeftDefaultLayout from '../left-default-layout';
import RightDefaultLayout from '../right-default-layout';
import { useCommonStyle } from '../../../styles';

const DefaultLayout = (props: any) => {
  const commonStyle = useCommonStyle();

  return (
    <div className={commonStyle.DefaultLayout}>
      <LeftDefaultLayout />
      <RightDefaultLayout>{props.children}</RightDefaultLayout>
    </div>
  );
};

export default DefaultLayout;