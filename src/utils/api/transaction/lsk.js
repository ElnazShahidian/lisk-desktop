/* eslint-disable max-lines */
import { transactions } from '@liskhq/lisk-client';

import {
  tokenMap,
  minFeePerByte,
  DEFAULT_NUMBER_OF_SIGNATURES,
  DEFAULT_SIGNATURE_BYTE_SIZE,
  MODULE_ASSETS_MAP,
  moduleAssetSchemas,
  BASE_FEES,
} from '@constants';

import { joinModuleAndAssetIds } from '@utils/moduleAssets';
import { createTransactionObject } from '@utils/transaction';
import { validateAddress } from '../../validators';
import http from '../http';
import { getDelegates } from '../delegate';

const httpPrefix = '/api/v2';

const httpPaths = {
  fees: `${httpPrefix}/fees`,
  transactions: `${httpPrefix}/transactions`,
  transaction: `${httpPrefix}/transactions`,
  transactionStats: `${httpPrefix}/transactions/statistics`,
  schemas: `${httpPrefix}/transactions/schemas`,
};

/**
 * Retrieves the details of a single transaction
 *
 * @param {Object} data
 * @param {String} data.params
 * @param {String} data.params.id - Id of the transaction
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} Transaction details API call
 */
export const getTransaction = ({
  params, network, baseUrl,
}) => http({
  path: httpPaths.transaction,
  params,
  network,
  baseUrl,
});

const filters = {
  address: { key: 'address', test: address => !validateAddress(tokenMap.LSK.key, address) },
  timestamp: { key: 'timestamp', test: str => /^(\d+)?:(\d+)?$/.test(str) },
  amount: { key: 'amount', test: str => /^(\d+)?:(\d+)?$/.test(str) },
  limit: { key: 'limit', test: num => parseInt(num, 10) > 0 },
  offset: { key: 'offset', test: num => parseInt(num, 10) >= 0 },
  moduleAssetId: { key: 'moduleAssetId', test: str => /\d:\d/.test(str) },
  height: { key: 'height', test: num => parseInt(num, 10) > 0 },
  sort: {
    key: 'sort',
    test: str => ['amount:asc', 'amount:desc', 'fee:asc', 'fee:desc', 'timestamp:asc', 'timestamp:desc'].includes(str),
  },
};

/**
 * Retrieves the list of transactions for given parameters
 *
 * @param {Object} data
 * @param {Object} data.network - Network setting from Redux store
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.params
 * @param {String} data.params.address Sender or recipient account
 * @param {String} data.params.dateFrom Unix timestamp, the start time of txs
 * @param {String} data.params.dateTo Unix timestamp, the end time of txs
 * @param {String} data.params.amountFrom The minimum value of txs
 * @param {String} data.params.amountTo The maximum value of txs
 * @param {String} data.params.moduleAssetId The moduleAssetId. 2:0, 5:1, etc
 * @param {Number} data.params.offset Used for pagination
 * @param {Number} data.params.limit Used for pagination
 * @param {String} data.params.sort an option of 'amount:asc',
 * 'amount:desc', 'timestamp:asc', 'timestamp:desc',
 * @param {Object} data.params.height The height of the block whose transaction we want.
 * If passed, all other parameter will be ignored.
 * @returns {Promise} Transactions list API call
 */
export const getTransactions = ({
  network,
  params,
  baseUrl,
}) => {
  const normParams = {};

  // if blockId, ignore others
  if (params.blockId) {
    normParams.block = params.blockId;
  } else {
    // Validate params and fix keys
    Object.keys(params).forEach((key) => {
      if (filters[key] && filters[key].test(params[key])) {
        normParams[filters[key].key] = params[key];
      } else {
        // eslint-disable-next-line no-console
        console.log(`getTransactions: Dropped ${key} parameter, it's invalid.`, params[key]);
      }
    });
  }

  return http({
    network,
    path: httpPaths.transactions,
    params: normParams,
    baseUrl,
  });
};

/**
 * Fetches and generates an array of monthly number of delegate
 * registrations on Lisk blockchain.
 *
 * @param {Object} Network - Network setting from Redux store
 * @returns {Promise} Registered delegates list API call
 */
export const getRegisteredDelegates = async ({ network }) => {
  const delegates = await getDelegates({
    network,
    params: { limit: 1 },
  });
  const txs = await getTransactions({
    network,
    params: { moduleAssetId: '5:0', limit: 100 },
  });

  if (delegates.error || txs.error) {
    return Error('Error fetching data.');
  }

  const getDate = (timestamp) => {
    const d = new Date(timestamp * 1000);
    return `${new Date(d).getFullYear()}-${new Date(d).getMonth() + 1}`;
  };

  // create monthly number of registration as a dictionary
  const monthStats = txs.data
    .map(tx => tx.block.timestamp)
    .reduce((acc, timestamp) => {
      const date = getDate(timestamp);
      acc[date] = typeof acc[date] === 'number' ? acc[date] + 1 : 1;
      return acc;
    }, {});

  // Create a sorted array of monthly accumulated number of registrations
  const res = Object.keys(monthStats)
    .sort((a, b) => -1 * (b - 1))
    .reduce((acc, month) => {
      if (acc[0][0] === month) {
        acc.unshift([null, acc[0][1] - monthStats[month]]);
      } else if (acc[0][0] === null) {
        acc[0][0] = month;
        acc.unshift([null, acc[0][1] - monthStats[month]]);
      }

      return acc;
    }, [[getDate(txs.data[0].block.timestamp), delegates.meta.total]]);

  // Add the date of one month before the last tx
  res[0][0] = getDate(txs.data[txs.data.length - 1].block.timestamp - 2670000);

  return res;
};

/**
 * Retrieves the overall statistics of network transactions.
 *
 * @param {Object} data
 * @param {Object} data.params
 * @param {String} data.params.period - An option of 'day' or 'month'
 * @param {Number} data.params.limit - The number of results
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Object} Network transactions statistics
 */
export const getTransactionStats = ({ network, params: { period } }) => {
  const normParams = {
    week: { path: 'day', limit: 7 },
    month: { path: 'month', limit: 6 },
    year: { path: 'month', limit: 12 },
  };

  return http({
    path: `${httpPaths.transactionStats}/${normParams[period].path}`,
    params: { limit: normParams[period].limit },
    network,
  });
};

/**
 * Retrieves transaction schemas.
 *
 * @param {Object} data
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
export const getSchemas = ({ baseUrl }) => http({
  path: httpPaths.schemas,
  baseUrl,
});

/**
 * Returns a dictionary of base fees for low, medium and high processing speeds
 * @returns {Promise<{Low: number, Medium: number, High: number}>} with low,
 * medium and high priority fee options
 */
export const getTransactionBaseFees = network =>
  http({
    path: httpPaths.fees,
    searchParams: {},
    network,
  })
    .then((response) => {
      const { feeEstimatePerByte } = response.data;
      return {
        Low: feeEstimatePerByte.low,
        Medium: feeEstimatePerByte.medium,
        High: feeEstimatePerByte.high,
      };
    });

/**
 * Returns the actual tx fee based on given tx details
 * and selected processing speed
 *
 * @param {String} txData - The transaction object
 * @param {Object} selectedPriority - network configuration
 * @returns {Promise} Object containing value, error and feedback
 */
// eslint-disable-next-line max-statements
export const getTransactionFee = async ({
  transaction, selectedPriority,
}) => {
  const feePerByte = selectedPriority.value;

  const {
    moduleAssetId, ...rawTransaction
  } = transaction;
  const schema = moduleAssetSchemas[moduleAssetId];
  const maxAssetFee = MODULE_ASSETS_MAP[moduleAssetId].maxFee;
  const transactionObject = createTransactionObject(rawTransaction, moduleAssetId);

  const minFee = transactions.computeMinFee(schema, {
    ...transactionObject,
    signatures: undefined,
  }, {
    baseFees: BASE_FEES,
  });

  // tie breaker is only meant for medium and high processing speeds
  const tieBreaker = selectedPriority.selectedIndex === 0
    ? 0 : minFeePerByte * feePerByte * Math.random();

  const size = transactions.getBytes(schema, {
    ...transactionObject,
    signatures: new Array(DEFAULT_NUMBER_OF_SIGNATURES).fill(
      Buffer.alloc(DEFAULT_SIGNATURE_BYTE_SIZE),
    ),
  }).length;

  const calculatedFee = Number(minFee + BigInt(size * feePerByte) + BigInt(tieBreaker));
  const fee = Math.min(calculatedFee, maxAssetFee);
  const roundedValue = transactions.convertBeddowsToLSK(fee.toString());

  const feedback = transaction.amount === ''
    ? '-'
    : `${(roundedValue ? '' : 'Invalid amount')}`;

  return {
    value: roundedValue,
    error: !!feedback,
    feedback,
  };
};

/**
 * creates a new transaction
 *
 * @param {Object} transaction The transaction information
 * @param {String} transactionType The transaction type title
 * @returns {Promise} promise that resolves to a transaction or
 * rejects with an error
 */
export const create = ({
  network,
  moduleAssetId,
  ...transactionObject
}) => new Promise((resolve, reject) => {
  const { networkIdentifier } = network.networks.LSK;
  const {
    passphrase, ...rawTransaction
  } = transactionObject;

  const schema = moduleAssetSchemas[moduleAssetId];
  const transaction = createTransactionObject(rawTransaction, moduleAssetId);

  try {
    const signedTransaction = transactions.signTransaction(
      schema, transaction, Buffer.from(networkIdentifier, 'hex'), passphrase,
    );

    resolve(signedTransaction);
  } catch (error) {
    reject(error);
  }
});

/**
 * broadcasts a transaction over the network
 *
 * @param {object} transaction
 * @param {Object} network
 * @param {string} network.name - the network name, e.g. mainnet, betanet
 * @param {string} network.address - the node address e.g. https://betanet-lisk.io
 * @returns {Promise} promise that resolves to a transaction or rejects with an error
 */
export const broadcast = async ({ transaction, serviceUrl }) => {
  const moduleAssetId = joinModuleAndAssetIds({
    moduleID: transaction.moduleID,
    assetID: transaction.assetID,
  });
  const schema = moduleAssetSchemas[moduleAssetId];
  const binary = transactions.getBytes(schema, transaction);
  const payload = binary.toString('hex');
  const body = JSON.stringify({ transaction: payload });

  const response = await http({
    method: 'POST',
    baseUrl: serviceUrl,
    path: '/api/v2/transactions',
    body,
  });

  return response;
};
