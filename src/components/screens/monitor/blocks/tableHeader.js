import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (changeSort, t) => ([
  {
    title: t('Height'),
    classList: `${grid['col-xs-3']}`,
    sort: {
      fn: changeSort,
      key: 'height',
    },
  },
  {
    title: t('Date'),
    classList: `${grid['col-xs-3']}`,
  },
  {
    title: t('Generated by'),
    classList: `${grid['col-xs-3']}`,
  },
  {
    title: t('Transactions'),
    classList: `${grid['col-xs-2']}`,
  },
  {
    title: t('Forged'),
    classList: `${grid['col-xs-1']}`,
  },
]);
