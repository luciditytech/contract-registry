import { fromAscii, toAscii } from 'web3-utils';
import BigNumber from 'bignumber.js';

const ZERO_ADDRESS = `0x${'0'.repeat(40)}`;

const stringToBytes32 = (string) => {
  const bytes = fromAscii(string);
  return bytes + '0'.repeat(66 - bytes.length);
};

const bytes32ToString = bytes32 => toAscii(bytes32);

const areAddressesEqual = (a, b) => {
  const aBN = BigNumber(typeof a === 'string' ? a.toLowerCase() : a);
  const bBN = BigNumber(typeof b === 'string' ? b.toLowerCase() : b);

  return aBN.eq(bBN);
};

const isContractKilled = async (actionToExecute) => {
  try {
    await actionToExecute();
    return false;
  } catch (e) {
    return (e.toString().includes('is not a contract address'), 'should be not a contract address');
  }
};

module.exports = {
  stringToBytes32,
  bytes32ToString,
  areAddressesEqual,
  ZERO_ADDRESS,
  isContractKilled,
};
