import React from 'react';
import NavLeft from './NavLeft';
import Button from '@material-ui/core/Button';
import useStyles from './styles';

const LeftDefaultLayout = (props: any) => {
  const styles = useStyles();
  const [smallLeft, setSmallLeft] = React.useState(false);

  return (
    <div className={styles.leftLayout + ' ' + (smallLeft && styles.smallLeft)}>
      <div className={styles.headLeft}>
        <div className={styles.BoxInfoUser}>
          <img className={styles.avatar} src={'/images/avatar.svg'} alt="" />
          {
            !smallLeft && 
            <div className={styles.infoUser}>
              <div className="name">Alan Cooper</div>
              <div className="status">
                Verified Profile
                <img className="icon" src={'/images/icon-verified.svg'} alt="" />
              </div>
            </div>
          }
        </div>
        <Button className={styles.btnSmallBig + ' ' + (smallLeft && 'btnSmall')} onClick={() => setSmallLeft(!smallLeft)}></Button>
      </div>
      <NavLeft smallLeft={smallLeft}/>

      {
        !smallLeft &&
        <div className={styles.Copyright}>Copyright @Lemonade 2021. All rights reserved.</div>
      }
    </div>
  );
};

export default LeftDefaultLayout;