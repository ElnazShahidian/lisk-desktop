/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getActiveTokenAccount } from '@utils/account';
import { getTransaction } from '@api/transaction';
import { getDelegates } from '@api/delegate';
import withData from '@utils/withData';
import { parseSearchParams } from '@utils/searchParams';
import { withTranslation } from 'react-i18next';
import TransactionDetails from './transactionDetails';

const mapStateToProps = (state, ownProps) => ({
  address: getActiveTokenAccount(state).address,
  id: ownProps.match.params.id,
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
  netCode: state.network.networks.LSK.code,
});

const apis = {
  transaction: {
    apiUtil: (network, { token, transactionId }) =>
      getTransaction({ network, params: { transactionId } }, token),
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
      transactionId: parseSearchParams(ownProps.location.search).transactionId,
      network: state.network,
    }),
    transformResponse: response => response.data[0] || {},
    autoload: true,
  },
  votedDelegates: {
    apiUtil: ({ networks }, params) => getDelegates({ network: networks.LSK, params }),
    defaultData: {},
    transformResponse: (response) => {
      const responseMap = response.data.reduce((acc, delegate) => {
        acc[delegate.address] = delegate.summary?.address;
        return acc;
      }, {});
      return responseMap;
    },
  },
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(TransactionDetails);
