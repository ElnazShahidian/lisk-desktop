import { withTranslation } from 'react-i18next';
import React from 'react';
import FilterDropdownButton from '@shared/filterDropdownButton';

const BlockFilterDropdown = ({ t, filters, applyFilters }) => {
  const fields = [{
    label: t('Date'),
    name: 'date',
    type: 'date-range',
  }, {
    label: t('Height'),
    placeholder: t('i.e. {{value}}', { value: 10169746 }),
    name: 'height',
    type: 'integer',
  }, {
    label: t('Generated by'),
    placeholder: t('i.e. {{value1}} or {{value2}}', { value1: 'peterpan', value2: '123456789L' }),
    name: 'address',
    type: 'text',
  }];

  const props = { fields, filters, applyFilters };

  return <FilterDropdownButton {...props} />;
};

export default withTranslation()(BlockFilterDropdown);
