import { actionTypes } from '@constants';
import blocksReducer from './blocks';
import { genesis } from '../../../test/constants/accounts';

describe('Reducer: blocks(state, action)', () => {
  const blocks = [{
    id: 19812401289461240,
    timestamp: 7124087134,
    height: 123457,
  }, {
    id: 29812401289461240,
    timestamp: 7124087124,
    height: 123456,
  }];
  it('should return blocks object last blocks if action.type = actionTypes.newBlockCreated', () => {
    const state = {
      latestBlocks: [blocks[1]],
    };

    const action = {
      type: actionTypes.newBlockCreated,
      data: {
        block: blocks[0],
      },
    };
    const changedBlocks = blocksReducer(state, action);
    expect(changedBlocks).toEqual({
      latestBlocks: blocks,
    });
  });

  it('should action.blocks to state.latestBlocks if action.type = actionTypes.olderBlocksRetrieved', () => {
    const state = {
      latestBlocks: [blocks[0]],
    };

    const action = {
      type: actionTypes.olderBlocksRetrieved,
      data: {
        list: blocks,
        total: 1000,
      },
    };
    const changedBlocks = blocksReducer(state, action);
    expect(changedBlocks).toEqual({
      latestBlocks: blocks,
      total: 1000,
    });
  });

  it('stores forgers in the event of forgersRetrieved', () => {
    const state = {
      forgers: [],
      latestBlocks: [],
    };

    const action = {
      type: actionTypes.forgersRetrieved,
      data: [
        {
          totalVotesReceived: 1e9,
          status: 'awaitingSlot',
          lastBlock: 10000,
          username: genesis.dpos.delegate.username,
          nextForgingTime: 1620049927,
          address: genesis.summary.address,
        },
      ],
    };
    const changedBlocks = blocksReducer(state, action);
    expect(changedBlocks).toEqual({
      latestBlocks: [],
      forgers: action.data,
    });
  });
});
