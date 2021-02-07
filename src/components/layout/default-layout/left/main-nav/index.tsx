import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './style.scss';

const routers = [
  {
    title: 'Home',
    part: '/',
    icon: 'icon-home',
  },
  {
    title: 'Form',
    part: '/form',
    icon: 'icon-home',
  },
];

const MainNav = (props: any) => {
  const { location } = props;

  return (
    <ul className="main-nav">
      {routers.map((item, index) => {
        const iconClass = `main-nav__icon ${item.icon}`;
        const activeClass = location.pathname === item.part ? 'active' : '';
        const itemClass = `main-nav__item ${activeClass}`;
        return (
          <li
            key={index}
            className={itemClass}
          >
            <Link 
              to={item.part}
              className="main-nav__item-link"
            >
              <i className={iconClass} />
              {item.title}
            </Link>
          </li>
        )
      })}
    </ul>
  );
};

export default withRouter(MainNav);
