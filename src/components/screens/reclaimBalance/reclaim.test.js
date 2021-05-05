import { mountWithRouterAndStore } from '@utils/testHelpers';
import { truncateAddress } from '@utils/account';
import { addSearchParamsToUrl } from '@utils/searchParams';
import { tokenMap } from '@constants';
import Reclaim from './reclaim';
import styles from './index.css';
import accounts from '../../../../test/constants/accounts';

jest.mock('@utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));

describe('Reclaim balance screen', () => {
  let wrapper;
  let props;
  const state = {
    account: {
      passphrase: 'test',
      info: {
        LSK: accounts.empty_account,
      },
    },
    settings: { token: tokenMap.LSK.key },
  };

  beforeEach(() => {
    props = {
      t: v => v,
      history: {
        push: jest.fn(),
      },
    };
    wrapper = mountWithRouterAndStore(Reclaim, props, {}, state);
  });

  it('should render legacy and new addresses', () => {
    const html = wrapper.html();
    expect(html).toContain(accounts.empty_account.legacy.address);
    expect(html).toContain(truncateAddress(accounts.empty_account.summary.address, 'medium'));
  });

  it('Opens send modal', () => {
    wrapper.find(styles.button).first().simulate('click');
    expect(
      addSearchParamsToUrl,
    ).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ }),
      { modal: 'reclaimBalance' },
    );
  });
});
