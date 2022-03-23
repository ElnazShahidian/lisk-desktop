import React from 'react';
import { MODULE_ASSETS_NAME_ID_MAP } from '@common/configuration';
import { toRawLsk } from '@token/utilities/lsk';
import TransactionPriority, { useTransactionPriority, useTransactionFeeCalculation } from '@shared/transactionPriority';
import FormBase from './formBase';
import useAmountField from './useAmountField';
import useRecipientField from './useRecipientField';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.transfer;

const FormBtc = (props) => {
  const {
    token, getInitialValue, account, network,
  } = props;

  const [
    selectedPriority, selectTransactionPriority, priorityOptions,
  ] = useTransactionPriority(token);
  const [amount, setAmountField] = useAmountField(getInitialValue('amount'), account.summary?.balance ?? 0, token);
  const [recipient, setRecipientField] = useRecipientField(getInitialValue('recipient'));
  const { fee, maxAmount, minFee } = useTransactionFeeCalculation({
    network,
    selectedPriority,
    token,
    account,
    priorityOptions,
    transaction: {
      amount: toRawLsk(amount.value),
      moduleAssetId,
      recipient: recipient.value,
    },
  });

  const fieldUpdateFunctions = { setAmountField, setRecipientField };
  const fields = {
    amount,
    recipient,
    selectedPriority,
    fee,
  };

  return (
    <FormBase
      {...props}
      fields={fields}
      fieldUpdateFunctions={fieldUpdateFunctions}
      maxAmount={maxAmount}
    >
      <TransactionPriority
        token={token}
        fee={fee}
        minFee={minFee.value}
        priorityOptions={priorityOptions}
        selectedPriority={selectedPriority.selectedIndex}
        setSelectedPriority={selectTransactionPriority}
      />
    </FormBase>
  );
};

export default FormBtc;
