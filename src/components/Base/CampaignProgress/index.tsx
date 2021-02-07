import React from 'react';
import BigNumber from 'bignumber.js';
import { Link } from 'react-router-dom';
import {Button, Tooltip } from '@material-ui/core';
import { getShortNumberBuyDecimals } from '../../../utils/formatNumber';
import { getShortTokenSymbol } from '../../../utils/token';

import useStyles from './style';

interface CampaignProgressProps {
  campaign: {
    tokenSold: number;
    tokenLeft: number;
    totalTokens: number;
    tokenSymbol?: string; 
    ethRaised?: number;
  };

  className?: string;
  buyNow?: string;
}

const CampaignProgress: React.FC<CampaignProgressProps> = (props: CampaignProgressProps) => {
  const classes = useStyles();
  const mainClass = classes.campaignProgress;

  const {
    campaign,
    className = '',
    buyNow
  } = props;

  const {
    totalTokens,
    tokenSold,
    tokenLeft,
    tokenSymbol = '',
  } = campaign;

  let progress = 0;
  if (totalTokens) {
    const tokenSoldNumber = new BigNumber(tokenSold);
    const totalTokensNumber = new BigNumber(totalTokens);
    progress = 100 * tokenSoldNumber.div(totalTokensNumber).toNumber();
  }

  const progressStyleObject = {
    width: `${progress}%`,
  };

  const shortTokenLeft = getShortNumberBuyDecimals(tokenLeft);
  const shortTotalTokens = getShortNumberBuyDecimals(totalTokens);
  const shortTokenSold = getShortNumberBuyDecimals(tokenSold);

  const shortTokenSymbol = getShortTokenSymbol(tokenSymbol as string);

  return (
    <div className={`${mainClass} ${className}`}>
      <div className={`${mainClass}__left`}>
          <div className={`${mainClass}__left-value`}>
            <Tooltip title={<p style={{ fontSize: 15 }}>{shortTokenLeft} {tokenSymbol}</p>}>
              <div className={`${mainClass}--wordBreak ${mainClass}__left-value--flex`}>
                {shortTokenLeft}
                <span className={`${mainClass}__left-title`}>
                  {shortTokenSymbol} Left
                </span>
              </div>
            </Tooltip>
          </div>
      </div>

      <div className={`${mainClass}__progress`}>
        <div className={`${mainClass}__progress-sold`} style={progressStyleObject} />
      </div>

      <div className={`${mainClass}__explication`}>
        <div className={`${mainClass}__explication-item`}>
          <div className={`${mainClass}__explication-item-bar sold`}></div>
          <div className={`${mainClass}__explication-item-detail`}>
            <div className={`${mainClass}__explication-item-detail-subtitle`}>
              Coins sold
            </div>
            <div className={`${mainClass}__explication-item-detail-title`}>
              <Tooltip title={<p style={{ fontSize: 15 }}>{`${shortTokenSold} ${tokenSymbol}`}</p>}>
                <span className={`${mainClass}__explication-item-inner-title`}>
                  {shortTokenSold} &nbsp;
                  {shortTokenSymbol}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className={`${mainClass}__explication-item`}>
          <div className={`${mainClass}__explication-item-bar total`}></div>
          <div className={`${mainClass}__explication-item-detail`}>
            <div className={`${mainClass}__explication-item-detail-subtitle`}>
              Total coins need to sold out
            </div>
            <div className={`${mainClass}__explication-item-detail-title ${mainClass}--wordBreak`}>
              <Tooltip title={<p style={{ fontSize: 15 }}>{`${shortTotalTokens} ${tokenSymbol}`}</p>}>
                  <span className={`${mainClass}__explication-item-inner-title`}>
                    {shortTotalTokens} &nbsp;
                    {shortTokenSymbol}
                  </span>
              </Tooltip>
            </div>
          </div>
        </div>
        {
          buyNow && (
          <div className={`${mainClass}__explication-item`}>
            <Button endIcon={<span className='iconButton'><img src="/images/icon-right-arrow.svg" alt="right-arrow"/></span>}
                className={classes.buttonGoto}>
              <Link to={`/buy-token?campaignId=${buyNow}`}>Buy Now</Link>
            </Button>
          </div>
          )
        }
      </div>
    </div>
  );
};

export default CampaignProgress;
