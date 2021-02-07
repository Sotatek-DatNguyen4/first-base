import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    login: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '& .login__wrap': {
        width: '500px',
        maxWidth: '100%',
        textAlign: 'center',
      },
      '& .login__logo': {
        marginBottom: '15px',
      },
      '& .login__logo img': {
        width: '80px',
      },

      '& .login__title': {
        fontWeight: 900,
        color: theme.custom.colors.primary,
        marginBottom: '18px',
        fontSize: '30px',
      },
      '& .login__description': {
        fontSize: '16px',
        marginBottom: '30px',
      },
      '& .login__button': {
        marginBottom: '30px',
      },
      '& .login__logo-metamask img': {
        width: '80px',
      },

      [theme.breakpoints.up('md')]: {
        '& .login__title': {
          fontSize: '60px',
          lineHeight: '70px',
        },
        '& .login__logo': {
          marginBottom: '30px',
          '& img': {
            maxWidth: '100%',
          }
        },
        '& .login__logo img': {
          width: 'auto',
        },
        '& .login__description': {
          marginBottom: '60px',
        },
        '& .login__button button': {
          height: '60px',
        },
        '& .login__logo-metamask img': {
          width: 'auto',
        },
      },
    }
  };
});

export default useStyles
