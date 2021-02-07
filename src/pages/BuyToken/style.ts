import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    buyToken: {
      backgroundColor: theme.custom.colors.mainBackground,
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '&__logo': {
        textAlign: 'center',
        marginBottom: '42px',
      },
      '&__wrapper': {
        width: '545px',
        maxWidth: '100%',
      },
      '&__campaign': {
        backgroundColor: '#fff',
        border: '1px solid #F0F0F0',
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
        borderRadius: '10px',
        padding: '45px 60px',
        marginBottom: '20px',
      },
      '&__campaign-duration': {
        fontSize: '16px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '5px',
        '& span': {
          marginLeft: '9px',
          position: 'relative',
          top: '-2px',
        }
      },
      '&__campaign-title': {
        fontSize: '20px',
        fontWeight: 'bold',
        letterSpacing: '0.15px',
        lineHeight: '30px',
        marginBottom: '10px',
      },
      '&__campaign-title--wordBreak': {
        width: '100%',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      },
      '&__campaign-total': {
        letterSpacing: '0.15px',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
        '& .total': {
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 'bold',
          fontSize: '30px',
        },
        '& .unit': {
          fontSize: '16px',
          marginLeft: '10px',
        }
      },

      '&__campaign-progress': {
        marginBottom: '20px',
      },
      '&__campaign-explication': {
        display: 'flex',
        justifyContent: 'space-between',
      },

      '&__form-wrapper': {
        backgroundColor: '#fff',
        border: '1px solid #F0F0F0',
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
        borderRadius: '10px',
        padding: '45px 60px',
        marginBottom: '20px',
      },
      '&__input-wrapper': {
        height: '70px',
        border: '1px solid #DFDFDF',
        padding: '12px 15px',
        borderRadius: '5px',
      },

      '&__input-label': {
        display: 'block',
        fontSize: '12px',
        letterSpacing: '0.4px',
        color: '#9A9A9A',
      },

      '&__input': {
        width: '100%',
        height: '30px',
        maxWidth: '100%',
        letterSpacing: '0.4px',
        color: theme.custom.colors.secondaryText,
        border: 0,
        outline: 'none',
        fontWeight: 'bold',
        fontSize: '20px',
      },
      '&__input-error': {
        marginTop: '5px',
      },

      '&__form-amount-unit': {
        display: 'flex',
      },
      '&__form-token-convert-unit-wrap': {
        display: 'flex',
      },
      '&__form-token-convert': {
        flexGrow: 1,
      },

      '&__form-amount': {
        flexGrow: 1,
        marginBottom: '12px',
      },
      '&__form-exchange': {
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '12px',
        color: theme.custom.colors.secondary,
        '& span': {
          marginLeft: '5px',
        }
      },
      '&__loading': {
        textAlign: 'center',
        '& svg': {
          color: theme.custom.colors.primary,
        }
      },
      '&__campaign-not-found': {
        backgroundColor: '#fff',
        border: '1px solid #F0F0F0',
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
        borderRadius: '10px',
        padding: '45px 60px',
        marginBottom: '20px',
      },
      '&__form-reason-not-show-button': {
        backgroundColor: '#fff',
        border: '1px solid #F0F0F0',
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
        borderRadius: '10px',
        padding: '15px 60px',
        marginBottom: '20px',
        color: 'red',
        textAlign: 'center',
      },
      '&__balance': {
        marginBottom: '30px',
      },
      '&__balance-title': {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '5px',
      },
      '&__balance-content': {
        display: 'flex',
      },
      '&__balance-item': {
        fontSize: '16px',
        fontWeight: 500,
        '& span': {
          color: theme.custom.colors.secondary,
        },
        '&.usdt': {
          marginLeft: '30px',
        }
      },
    }
  };
});

export default useStyles;
