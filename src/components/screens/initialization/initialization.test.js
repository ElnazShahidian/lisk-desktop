import { mountWithRouter } from '../../../utils/testHelpers';
import Initialization from './index';
import { addSearchParamsToUrl } from '../../../utils/searchParams';
import styles from './initialization.css';

jest.mock('../../../utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));
window.open = jest.fn();

describe('Initialization', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      t: v => v,
      history: {
        push: jest.fn(),
      },
    };
    wrapper = mountWithRouter(Initialization, props);
  });

  it('Opens send modal', () => {
    wrapper.find(styles.button).first().simulate('click');
    expect(addSearchParamsToUrl).toHaveBeenNthCalledWith(1, expect.objectContaining({ }), { modal: 'send' });
  });

  it('Opens lisk blog windows', () => {
    wrapper.find('span').first().simulate('click');
    expect(window.open).toHaveBeenCalledWith(
      'https://lisk.io/blog/announcement/lisk-account-initialization',
      '_blank',
      'rel="noopener noreferrer',
    );
  });
});
