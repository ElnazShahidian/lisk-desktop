import React from 'react';
import { useSelector } from 'react-redux';

import { tokenMap } from '@constants';
import { fromRawLsk } from '@utils/lsk';
import DialogLink from '@toolbox/dialog/link';
import {
  calculateBalanceLockedInUnvotes,
  calculateBalanceLockedInVotes,
  getActiveTokenAccount,
} from '@utils/account';
import Icon from '@toolbox/icon';
import styles from './balanceInfo.css';

const Link = ({ sum }) => (
  <DialogLink
    className={`${styles.lockedBalance} ${styles.pointer} open-unlock-balance-dialog`}
    component="lockedBalance"
  >
    <Icon name="lock" />
    {`${fromRawLsk(sum)} ${tokenMap.LSK.key}`}
  </DialogLink>
);

const Text = ({ sum }) => (
  <span
    className={`${styles.lockedBalance} open-unlock-balance-dialog`}
    component="lockedBalance"
  >
    <Icon name="lock" />
    {`${fromRawLsk(sum)} ${tokenMap.LSK.key}`}
  </span>
);

const LockedBalanceLink = ({ activeToken, isWalletRoute }) => {
  const host = useSelector(state => getActiveTokenAccount(state));
  const lockedInVotes = useSelector(state => calculateBalanceLockedInVotes(state.voting));
  const lockedInUnvotes = activeToken === tokenMap.LSK.key && isWalletRoute && host
    ? calculateBalanceLockedInUnvotes(host.dpos?.unlocking) : undefined;

  if (lockedInUnvotes > 0) {
    return (
      <Link sum={lockedInUnvotes + lockedInVotes} />
    );
  }
  if (lockedInVotes > 0) {
    return (
      <Text sum={lockedInVotes} />
    );
  }
  return null;
};

export default LockedBalanceLink;
