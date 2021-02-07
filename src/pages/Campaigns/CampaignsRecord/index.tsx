import React, { useState, useEffect } from 'react'
import { TableRow, TableCell, Dialog, DialogContent, Divider, Tooltip } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import useStyles from './style';
import moment from "moment";

type CampaignsRecordProps = {
  campaign: {
    id: string;
    title: string;
    token: string;
    start_time: number;
    finish_time: number;
    affiliate: number;
    tokenGet: number;
    ethFor: number;
    campaign_hash: string;
    symbol: string;
    registed_by: string;
    is_pause: number;
  };

  currentOpen: string;
  setCurrentOpen: (id: string) => void;
}

const CampaignsRecord: React.FC<CampaignsRecordProps> = (props: CampaignsRecordProps) => {
  const { campaign, currentOpen, setCurrentOpen } = props;
  const classes = useStyles();

  let [openEdit, setOpenEdit] = useState(false);
  
  const today = new Date();
  const canBuy = today >= new Date(campaign.start_time * 1000) && today <= new Date(campaign.finish_time * 1000) && campaign.is_pause === 0;

  useEffect(() => {
    setOpenEdit(campaign.id === currentOpen);
  }, [currentOpen]);

  return (
      <TableRow className={classes.tableRow} key={campaign.id} component={Link} to={`/campaign-detail/${campaign.campaign_hash}`}>
          <TableCell className={classes.tableCellTitle} component="td" scope="row">
            <Tooltip title={<p style={{ fontSize: 15 }}>{campaign.title}</p>}>
              <span className={classes.wordBreak}>
                {campaign.title}
              </span>
            </Tooltip>
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            {/*{convertUnixTimeToDateTime(campaign.start_time)}*/}
            {moment.unix(campaign.start_time).format("hh:mm:ss A")}<br/>
            &nbsp;
            {moment.unix(campaign.start_time).format("MM/DD/YYYY")}
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            {/*{convertUnixTimeToDateTime(campaign.finish_time)}*/}
            {moment.unix(campaign.finish_time).format("hh:mm:ss A")}<br/>
            &nbsp;
            {moment.unix(campaign.finish_time).format("MM/DD/YYYY")}
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            <Tooltip title={<p style={{ fontSize: 15 }}>{campaign.symbol}</p>}>
              <span className={classes.wordBreak} style={{ width: 100 }}>
                {campaign.symbol}
              </span>
            </Tooltip>
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            <Tooltip title={<p style={{ fontSize: 15 }}>{campaign.is_pause === 1 ? 'Suspend': 'Active'}</p>}>
              <span className={`campaign-status campaign-${campaign.is_pause === 1 ? 'paused': 'active'}`}>
                
              </span>
            </Tooltip>
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            <div className={classes.tableCellFlex}>
              <div className="left">
                <img src={`/images/${campaign.affiliate === 1 ? 'icon_check.svg': 'icon_close.svg'}`} alt="icon-affiliate" />
                <span className={campaign.affiliate === 1 ? 'check': 'cancel'}>{campaign.affiliate === 1 ? 'Yes': 'No'}</span>
              </div>
              <div className="right">
                <img  src='/images/icon_menu.svg' alt="icon-menu" onClick={(e) => { 
                  e.preventDefault(); 

                  if (campaign.id === currentOpen && openEdit) {
                    setOpenEdit(false);
                    setCurrentOpen("");
                    return;
                  }

                  setCurrentOpen(campaign.id);
                }} />
                <Dialog hideBackdrop={true} disablePortal className={classes.editDialog} open={openEdit}>
                  <DialogContent className={classes.editDialogContent}>
                    <Link className={`${classes.editDialogView} dialog-cta`} to={`/campaign-detail/${campaign.campaign_hash}`}>View</Link>
                    {
                      canBuy && ( 
                          <>
                            <Divider />
                            <Link className={`${classes.editDialogButton} dialog-cta`} to={`/buy-token?campaignId=${campaign.campaign_hash}`}>Buy Token</Link>
                          </>
                      )
                    }
                  </DialogContent>
                </Dialog>
              </div>
            </div>
        </TableCell>
      </TableRow>
  )

};

export default CampaignsRecord;
