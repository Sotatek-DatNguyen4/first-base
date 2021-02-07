import React from 'react';
import useStyles from './styles';

const RightDefaultLayout: React.FC<any> = (props: any) => {
  const styles = useStyles();
  return (
    <div className={styles.rightLayout}>
      {props.children}
    </div>
  );
};

export default RightDefaultLayout;