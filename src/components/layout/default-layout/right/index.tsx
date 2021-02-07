import React from 'react';

const Right: React.FC<any> = (props: any) => {
  return (
    <div className="default-layout__right">
      {props.children}
    </div>
  );
};

export default Right;