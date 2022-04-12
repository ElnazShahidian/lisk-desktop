/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getBlock } from '@block/utilities/api';
import { getTransactions } from '@transaction/utilities/api';
import withData from '@common/utilities/withData';
import { selectSearchParamValue } from '@screens/router/searchParams';
import { tokenMap } from '@token/configuration/tokens';
import BlockDetails from './blockDetails';

const mapStateToProps = (state, ownProps) => ({
  id: selectSearchParamValue(ownProps.history.location.search, 'id'),
  height: selectSearchParamValue(ownProps.history.location.search, 'height'),
  currentHeight: state.blocks.latestBlocks.length ? state.blocks.latestBlocks[0].height : 0,
});
const ComposedBlockDetails = compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    blockDetails: {
      apiUtil: (network, params) => getBlock({ network, params }),
      getApiParams: (_, ownProps) => ({ blockId: ownProps.id, height: ownProps.height }),
      transformResponse: response => (response.data && response.data[0]),
    },
    blockTransactions: {
      apiUtil: (network, params) => getTransactions({ network, params }, tokenMap.LSK.key),
      defaultData: [],
      getApiParams: (_, ownProps) => {
        if (ownProps.id) return { blockId: ownProps.id };
        return { height: ownProps.height };
      },
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.data.filter(block =>
            !oldData.find(({ id }) => id === block.id))]
          : response.data
      ),
    },
  }),
  withTranslation(),
)(BlockDetails);

export default ComposedBlockDetails;