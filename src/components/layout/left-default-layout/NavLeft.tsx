import React from 'react';
import { Link, withRouter } from "react-router-dom";
import useStyles from './styles';

const nav = [
  {
    title: 'Home',
    part: '/',
    icon: 'icon-home',
  },
];

const NavLeft = (props: any) => {
  const styles = useStyles();
  const { smallLeft, location } = props;
  const [navLeft] = React.useState(nav);



  return (
    <ul className={styles.navLeft}>
      {navLeft.map((item, index) => {
        const iconClass = `icon ${item.icon} ${smallLeft ? 'icon-small' : ''}`;
        return (
          <li key={index} className={styles.itemNavLeft + ' ' + (location?.pathname === item.part && 'active')}>
            <Link 
              to={item.part} 
              className={styles.linkItemNavLeft + ' ' + (location?.pathname === item.part && 'active')}
            >
              <i className={iconClass}></i>
              {!smallLeft && item.title}
            </Link>
          </li>
        )
      })}
    </ul>
  );
};

export default withRouter(NavLeft);
