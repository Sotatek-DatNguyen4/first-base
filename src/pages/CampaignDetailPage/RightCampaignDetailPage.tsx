import React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';

import useStyles from './styles';
import BigNumber from "bignumber.js";
import { getShortNumberBuyDecimals } from '../../utils/formatNumber';
import { useTypedSelector } from '../../hooks/useTypedSelector'

interface MatchParams {
  transactions: object[],
  loading: boolean,
  failure: "",
  lastPage: number;
  handlePaginationChange: (event:any, page: number) => void;
  currentPage: number;
}

const RightCampaignDetailPage: React.FC<MatchParams> = (props: MatchParams) => {
  const styles = useStyles();
  const { loading, transactions, failure, lastPage, currentPage, handlePaginationChange } = props;
  const { data: campaignDetail } = useTypedSelector(state => state.campaignDetail);

  return (
    <div className={styles.rightPage}>
      <h2 className={styles.titleTable}>Transaction List</h2>
      <TableContainer component={Paper} className={styles.tableTransactionList}>
        {
          loading ? (
            [...Array(10)].map((num, index) => (
            <div key={index}>
              <Skeleton className={styles.skeleton} width="100%" />
            </div>
          ))):  (
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={styles.TableCellHead}>PURCHASED ADDRESS</TableCell>
              <TableCell className={styles.TableCellHead}>CURRENCY</TableCell>
              <TableCell className={styles.TableCellHead}>TOKEN</TableCell>
              <TableCell className={styles.TableCellHead} align="center">TIME</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions && transactions.length > 0 && transactions.map((row: any, index: any) => {
              const { value_paid: currency = '', amount_received: amountReceived = ''} = row;
              const currencyConvert = new BigNumber(currency).toString();
              const amountReceivedConvert = new BigNumber(amountReceived).toString();

              return (
                <TableRow key={index} className={styles.TableRowBody}>
                  <TableCell className={`${styles.TableCellBody}`} title={row?.purchaser}>
                    <Tooltip title={<p style={{ fontSize: 15 }}>{row?.purchaser}</p>}>
                    <span className={styles.wordBreak}>
                    {row?.purchaser}
                    </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className={`${styles.TableCellBody}`}>
                    <Tooltip title={<p style={{ fontSize: 15 }}>{currencyConvert} {row?.token ? 'USDT': 'ETH'}</p>}>
                    <span className={styles.wordBreak}>
                      {currencyConvert} {row?.token ? 'USDT': 'ETH'}
                    </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className={`${styles.TableCellBody}`}>
                    <Tooltip title={<p style={{ fontSize: 15 }}>{amountReceivedConvert} {campaignDetail && campaignDetail.tokenSymbol}</p>}>
                    <span className={styles.wordBreak}>
                      {amountReceivedConvert} {campaignDetail && campaignDetail.tokenSymbol}
                    </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className={`${styles.TableCellBody}`} align="center">
                    {moment(row?.created_at).format("hh:mm:ss A")}<br/>
                    {moment(row?.created_at).format("MM/DD/YYYY")}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        )}
        {
          failure ? <p className={styles.errorMessage}>{failure}</p> : ((!transactions || transactions.length === 0) && !loading)  ? <p className={styles.noDataMessage}>There is no data</p> : ( lastPage > 1 && <Pagination page={currentPage} className={styles.pagination} count={lastPage} onChange={handlePaginationChange} /> ) 
        }
      </TableContainer>
    </div>
  );
};

export default RightCampaignDetailPage; 
