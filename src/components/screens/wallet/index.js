/* istanbul ignore file */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { parseSearchParams, addSearchParamsToUrl } from '@utils/searchParams';
import { transactionsRetrieved } from '@actions';
import {
  selectAccount,
  selectActiveToken,
  selectSettings,
  selectTransactions,
} from '@store/selectors';
import TabsContainer from '@toolbox/tabsContainer/tabsContainer';
import Overview from './overview';
import DelegateTab from './delegateProfile';
import MultiSignatureTab from './multiSignature';
import VotesTab from './votes';
import Transactions from './transactions';

const Wallet = ({ t, history }) => {
  const dispatch = useDispatch();
  const account = useSelector(selectAccount);
  const activeToken = useSelector(selectActiveToken);
  const { discreetMode } = useSelector(selectSettings);
  const { confirmed, pending } = useSelector(selectTransactions);
  const { isDelegate, address } = account.info[activeToken].summary;

  useEffect(() => {
    dispatch(transactionsRetrieved({ address }));
  }, [confirmed.length]);

  useEffect(() => {
    const params = parseSearchParams(history.location.search);
    if (params.recipient !== undefined) {
      addSearchParamsToUrl(history, { modal: 'send' });
    }
  }, []);

  return (
    <section>
      <Overview
        isWalletRoute
        activeToken={activeToken}
        discreetMode={discreetMode}
        account={account.info[activeToken]}
        hwInfo={account.hwInfo}
        transactions={confirmed}
      />
      <TabsContainer>
        <Transactions
          pending={pending || []}
          confirmedLength={confirmed.length}
          activeToken={activeToken}
          discreetMode={discreetMode}
          tabName={t('Transactions')}
          tabId="Transactions"
          address={address}
        />
        {activeToken !== 'BTC' ? (
          <VotesTab
            history={history}
            address={address}
            tabName={t('Votes')}
            tabId="votes"
          />
        ) : null}
        {isDelegate
          ? (
            <DelegateTab
              tabClassName="delegate-statistics"
              tabName={t('Delegate profile')}
              tabId="delegateProfile"
              account={account.info[activeToken]}
            />
          )
          : null}
        {isMultiSignature
          ? (
            <MultiSignatureTab
              // tabClassName="delegate-statistics"
              tabName={t('Multisignatures')}
              tabId="multiSignatures"
            />
          )
          : null}
      </TabsContainer>
    </section>
  );
};

export default withTranslation()(Wallet);
