import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../store/actions/user';
import Container from '@material-ui/core/Container';
import { withRouter } from 'react-router-dom';
import Button from '../../components/common/button';
import loginLogo from '../../assets/images/login-logo.png';
import metamskLogo from '../../assets/images/metamask-logo.png';

import './style.scss';

const Login: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();
  const { data = '', loading = false } = useSelector((state: any) => state.user);

  useEffect(() => {
    const { history } = props;
    if (data) {
      history.push('/');
    }
  }, [data, props]);

  const handleUserLogin = () => {
    dispatch(login());
  };

  return (
    <Container fixed>
      <div className="login">
        <div className="login__wrap">
          <div className="login__logo">
            <img src={loginLogo} alt="login-logo" />
          </div>
          <h2 className="login__title">
            Lemonade Login
          </h2>
          <Button
            onClick={handleUserLogin}
            label="Login with Metamask"
            loading={loading}
            disabled={loading}
            buttonType="metamask"
            className="login__button"
          />
          <div className="login_logo-metamask">
            <img src={metamskLogo} alt="logo-metamask" />
          </div>
        </div>
      </div>
    </Container>
  )
};

export default withRouter(Login);