import React from 'react';
import { tokenMap } from '@token/configuration/tokens';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { useTransactionFeeCalculation, useTransactionPriority } from '@transaction/manage/transactionPriority';
import TransactionSummary from '@transaction/detail/manager/transactionSummary';
import TransactionInfo from '@transaction/detail/info/transactionInfo';
import styles from './summary.css';

const Summary = ({
  balanceReclaimed,
  nextStep,
  account,
  network,
  t,
}) => {
  const [
    selectedPriority,, priorityOptions,
  ] = useTransactionPriority(tokenMap.LSK.key);

  const { minFee } = useTransactionFeeCalculation({
    network,
    selectedPriority,
    token: tokenMap.LSK.key,
    account: account.info.LSK,
    priorityOptions,
    transaction: {
      moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.reclaimLSK,
      nonce: account.info.LSK.sequence.nonce,
      senderPublicKey: account.info.LSK.summary.publicKey,
      amount: account.info.LSK.legacy.balance,
    },
  });

  const onSubmit = () => {
    nextStep({
      rawTransaction: {
        fee: minFee,
      },
      actionFunction: balanceReclaimed,
    });
  };

  return (
    <TransactionSummary
      title={t('Transaction summary')}
      confirmButton={{
        label: t('Continue'),
        onClick: onSubmit,
      }}
      fee={minFee.value}
      classNames={styles.summaryContainer}
    >
      <TransactionInfo
        account={account}
        moduleAssetId={MODULE_ASSETS_NAME_ID_MAP.reclaimLSK}
      />
    </TransactionSummary>
  );
};

export default Summary;