/* istanbul ignore file */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { bookmarkAdded, bookmarkUpdated, bookmarkRemoved } from '@common/store/actions';
import { getAccount } from '@common/utilities/api/account';
import withData from '@common/utilities/withData';
import { selectSearchParamValue } from '@common/utilities/searchParams';
import AddBookmark from './addBookmark';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  token: state.settings.token,
  network: state.network,
});

const mapDispatchToProps = {
  bookmarkAdded,
  bookmarkUpdated,
  bookmarkRemoved,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withData({
    account: {
      apiUtil: (network, params) => getAccount({ network, params }, params.token),
      defaultData: {},
      getApiParams: (state, props) => ({
        token: state.settings.token.active,
        address: selectSearchParamValue(props.history.location.search, 'address'),
      }),
    },
  }),
  withTranslation(),
)(AddBookmark);