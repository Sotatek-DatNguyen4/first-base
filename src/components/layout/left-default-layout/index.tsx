import React from 'react';
import NavLeft from './NavLeft';
import Button from '@material-ui/core/Button';
import './styles';

const LeftDefaultLayout = (props: any) => {
  const [smallLeft, setSmallLeft] = React.useState(false);

  return (
    <div className="left-default-layout">
      <div className="left-default-layout__header">
        <div className="left-default-layout__user">
          <img className="left-default-layout__user-avatar" src={'/images/avatar.svg'} alt="avatar" />
          {
            !smallLeft && 
            <div className="left-default-layout__infoUser">
              <div className="name">Alan Cooper</div>
              <div className="status">
                Verified Profile
                <img className="icon" src={'/images/icon-verified.svg'} alt="profile" />
              </div>
            </div>
          }
        </div>
        <Button onClick={() => setSmallLeft(!smallLeft)} />
      </div>

      <NavLeft smallLeft={smallLeft} />

      {!smallLeft && (
        <div className="left-default-layout__copyright">Copyright @Lemonade 2021. All rights reserved.</div>
      )}
    </div>
  );
};

export default LeftDefaultLayout;