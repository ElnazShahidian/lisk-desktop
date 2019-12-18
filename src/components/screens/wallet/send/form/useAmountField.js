import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import numeral from 'numeral';
import { validateAmountFormat } from '../../../../../utils/validators';
import regex from '../../../../../utils/regex';

const useAmountField = (initialValue, getMaxAmount) => {
  const { t, i18n } = useTranslation();
  const {
    settings: { token: { active: token } },
  } = useSelector(state => state);

  const getAmountFeedbackAndError = (value) => {
    let { message: feedback } = validateAmountFormat({ value, token });

    if (!feedback && parseFloat(getMaxAmount()) < numeral(value).value()) {
      feedback = t('Provided amount is higher than your current balance.');
    }
    return { error: !!feedback, feedback };
  };

  const [amountField, setAmountField] = useState(initialValue
    ? {
      ...getAmountFeedbackAndError(initialValue),
      value: initialValue,
      required: true,
    }
    : {
      error: false,
      feedback: '',
      value: '',
      required: true,
    });

  const onAmountInputChange = ({ value }) => {
    const { leadingPoint } = regex.amount[i18n.language];
    value = leadingPoint.test(value) ? `0${value}` : value;
    setAmountField({
      ...amountField,
      value,
      ...getAmountFeedbackAndError(value),
    });
  };

  return [amountField, onAmountInputChange];
};

export default useAmountField;
