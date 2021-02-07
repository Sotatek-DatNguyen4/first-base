import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../store/actions/user';
import Container from '@material-ui/core/Container';
import useStyles from './style';
import { withRouter } from 'react-router-dom';
import Button from '../../components/common/button';

const loginLogo = '/images/login-logo.png';
const metamskLogo = '/images/metamask-logo.png';

const Login: React.FC<any> = (props: any) => {
  const classes = useStyles();
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
      <div className={classes.login}>
        <div className="login__wrap">
          <div className="login__logo">
            <img src={loginLogo} alt="login-logo" />
          </div>
          <h2 className="login__title">
            Lemonade Login
          </h2>
          <div className="login__description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
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